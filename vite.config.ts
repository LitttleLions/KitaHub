import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Remove static import: import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
// Make the function async to allow await for dynamic import
export default defineConfig(async ({ mode }) => {
  // Dynamically import componentTagger only in development mode
  const plugins = [react()];
  if (mode === 'development') {
    try {
      const { componentTagger } = await import("lovable-tagger");
      plugins.push(componentTagger());
    } catch (e) {
      console.error("Failed to load lovable-tagger:", e);
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
      watch: { // Enable polling for HMR in Docker
        usePolling: true, // Re-enable polling for Docker HMR
        // interval: 100 // Optional: Adjust polling interval if needed
      }
    }, // Close server object here
    plugins: plugins, // plugins should be a top-level property
    resolve: { // resolve should be a top-level property
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
