// QuickThinkers — löser in en engångsinbjudan till adminportalen.
// Den inbjudna väljer själv e-post och lösenord; kontot skapas bekräftat
// (inbjudningslänken är beviset) och får rollen admin.
//
// Driftsätts med verify_jwt = false: den inbjudna har inget konto än.
// Skyddet är koden — 244 bitar slump, engångs, giltig i 7 dagar.
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function adminClient() {
  const secretKeys = Deno.env.get('SUPABASE_SECRET_KEYS');
  const key = secretKeys
    ? JSON.parse(secretKeys).default
    : Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  return createClient(Deno.env.get('SUPABASE_URL')!, key!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function sha256Hex(text: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const INVALID = 'Inbjudan är ogiltig, redan använd eller har gått ut. Be om en ny länk.';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Metoden stöds inte.' }, 405);

  let body: { token?: string; email?: string; password?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Ogiltig förfrågan.' }, 400);
  }

  const token = String(body.token ?? '');
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');
  const name = String(body.name ?? '').trim().slice(0, 60);

  if (!/^[0-9a-f]{64}$/.test(token)) return json({ error: INVALID }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return json({ error: 'Ange en giltig e-postadress.' }, 400);
  }
  if (password.length < 8) return json({ error: 'Lösenordet måste vara minst 8 tecken.' }, 400);

  const admin = adminClient();
  const tokenHash = await sha256Hex(token);
  const now = new Date().toISOString();

  // Lös in först — villkoren gör att bara ett anrop kan lyckas.
  const { data: claimed, error: claimError } = await admin
    .from('admin_invites')
    .update({ used_at: now })
    .eq('token_hash', tokenHash)
    .is('used_at', null)
    .is('revoked_at', null)
    .gt('expires_at', now)
    .select('id');
  if (claimError) return json({ error: 'Något gick fel. Försök igen.' }, 500);
  if (!claimed?.length) return json({ error: INVALID }, 400);
  const inviteId = claimed[0].id;

  // Släpp inbjudan igen om kontot inte kunde skapas, så personen kan rätta och försöka på nytt.
  const release = () => admin.from('admin_invites').update({ used_at: null }).eq('id', inviteId);

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: name ? { display_name: name } : undefined,
  });
  if (createError || !created?.user) {
    await release();
    const message = /already|registered|exists/i.test(createError?.message ?? '')
      ? 'Det finns redan ett konto med den e-postadressen. Använd en annan, eller be en admin ge ditt befintliga konto admin-rollen.'
      : /password/i.test(createError?.message ?? '')
        ? 'Lösenordet är för svagt. Välj ett längre lösenord.'
        : 'Kunde inte skapa kontot. Försök igen.';
    return json({ error: message }, 400);
  }

  const userId = created.user.id;

  // Profilen skapas av triggern on_auth_user_created; ge den admin-rollen.
  const { error: roleError } = await admin
    .from('profiles')
    .update({ role: 'admin', ...(name ? { display_name: name } : {}) })
    .eq('id', userId);
  if (roleError) {
    await admin.auth.admin.deleteUser(userId);
    await release();
    return json({ error: 'Kunde inte skapa kontot. Försök igen.' }, 500);
  }

  await admin.from('admin_invites').update({ used_by: userId }).eq('id', inviteId);

  return json({ ok: true });
});
