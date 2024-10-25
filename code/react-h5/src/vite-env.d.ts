/// <reference types="vite/client" />
/**
 * 这里添加定义方便ts代码提示
 */
interface ImportMetaEnv {
  readonly NODE_ENV: string;
  readonly VITE_BASE_API: string;
  readonly VITE_PUBLIC_PATH: string;
}
