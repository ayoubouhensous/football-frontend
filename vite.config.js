// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://api.football-data.org/v4',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''), // Réécriture pour faire correspondre le chemin
          headers: {
            'X-Auth-Token': env.VITE_FOOTBALL_API_KEY || '', // Assurez-vous que la clé API est bien dans votre .env
          }
        }
      }
    }
  };
});
