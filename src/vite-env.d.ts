/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string
    readonly VITE_HF_TOKEN: string
    // more env var...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
