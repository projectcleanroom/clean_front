/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string  // 추가된 부분
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}