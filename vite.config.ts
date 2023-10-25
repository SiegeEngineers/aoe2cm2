import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'
import {loadEnv} from "vite";
import inject from "@rollup/plugin-inject";

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    resolve: {
    },
    plugins: [react()],
    build: {
        rollupOptions: {
            plugins: [inject({process: 'process'})],
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        css: true,
        reporters: ['verbose'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*'],
            exclude: [],
        }
    },
})
