import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        "Download-Button": resolve("Download-Button/index.html"),
      },
    },
  },
});
