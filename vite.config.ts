import { defineConfig, UserConfig } from "vite";

export default defineConfig(({ mode }) => {
    const port: number = parseInt(process.env.APP_PORT || "8000");

    const defaultOptions: UserConfig = {
        base: "./",
        server: {
            host: true,
            port
        }
    };
    
    return {
        ...defaultOptions
    };
});
