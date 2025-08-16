/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TUSKY_API_KEY: string
  // Add other environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
