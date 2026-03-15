import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        "Download-Button": resolve("Download-Button/index.html"),
        "Navbar-Icons": resolve("Navbar-Icons/index.html"),
        "Neon-Button": resolve("Neon-Button/index.html"),
        "Send-Button": resolve("Send-Button/index.html"),
      },
    },
  },
});
