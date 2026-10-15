import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const page = (file) => fileURLToPath(new URL(file, import.meta.url));

// Två sidor: appen (index.html) och adminportalen (admin.html).
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        app: page('./index.html'),
        admin: page('./admin.html'),
      },
    },
  },
});
