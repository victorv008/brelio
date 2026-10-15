// QuickThinkers — "Radera mitt konto" (GDPR). Användaren raderar sitt eget
// konto; profil och all data försvinner via ON DELETE CASCADE.
//
// Driftsätts med verify_jwt = false: funktionen verifierar själv anroparens
// session mot Auth.
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Metoden stöds inte.' }, 405);

  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'Du behöver vara inloggad.' }, 401);

  // Skydd mot oavsiktliga anrop: klienten måste skicka { confirm: true }.
  let body: { confirm?: boolean };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Ogiltig förfrågan.' }, 400);
  }
  if (body.confirm !== true) return json({ error: 'Bekräftelse saknas.' }, 400);

  const admin = adminClient();
  const { data: authData, error: authError } = await admin.auth.getUser(token);
  const user = authData?.user;
  if (authError || !user) return json({ error: 'Ogiltig session. Logga in igen.' }, 401);

  // Sista admin får inte radera sig själv — då går adminportalen inte att nå.
  const { data: profile } = await admin
    .from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role === 'admin') {
    const { count } = await admin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'admin')
      .eq('status', 'active')
      .neq('id', user.id);
    if (!count) {
      return json({ error: 'Du är den enda admin. Utse en annan admin innan du raderar ditt konto.' }, 400);
    }
  }

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return json({ error: 'Kunde inte radera kontot. Försök igen.' }, 500);

  return json({ ok: true });
});
