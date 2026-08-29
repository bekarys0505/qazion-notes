import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "QAZION Notes",
        short_name: "QAZION Notes",
        description: "Менің жеке жазбаларым",
        theme_color: "#5f6cff",
        background_color: "#ffffff",
        display: "standalone",

        icons: [
          {
            src: "/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
});