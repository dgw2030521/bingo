import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import type { ConfigEnv } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
// https://vitejs.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated
export default ({ command, mode }: ConfigEnv) => {
  const currentEnv = loadEnv(mode, process.cwd());
  return defineConfig({
    plugins: [
      react(),
      legacy({
        targets: ['chrome 52'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        renderLegacyChunks: true,
      }),
      viteCompression({
        verbose: true, // 默认即可
        disable: false, // 开启压缩(不禁用)，默认即可
        deleteOriginFile: false, // 删除源文件
        threshold: 10240, // 对大于 10kb 的文件进行压缩
        algorithm: 'gzip', // 压缩算法
        ext: '.gz', // 文件类型
      }),
    ],
    // 项目部署的基础路径,
    base: currentEnv.VITE_PUBLIC_PATH,
    mode,
    resolve: {
      // alias: [
      //   { find: /^@/, replacement: resolve(__dirname, './src/BIZ') },
      //   {
      //     find: /^@CodeDefine/,
      //     replacement: resolve(__dirname, './src/CODE_DEFINE'),
      //   },
      // ],
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3001,
      cors: true,
      proxy: {
        // 代理ajax请求
        '/app-dev': {
          target: 'http://172.27.237.121:31954/',
          // target: 'http://172.43.60.108:31766/',

          changeOrigin: true,
          rewrite: path =>
            path.replace(/^\/app-dev\//, '/zczd/customer/app-customer/'),
        },
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            '@root-entry-name': 'variable',
          },
          javascriptEnabled: true,
        },
      },
    },
    // 构建
    build: {
      // outDir: `dist_${format(new Date(), 'yyyyMMdd_HHmm')}`, //输出路径  新增打日期包
      // 构建后是否生成 source map 文件
      sourcemap: mode !== 'production',
      target: 'es2015',
      // 打包去掉打印信息 保留debugger vite3需要单独安装terser才行
      // minify: 'terser',
      // terserOptions: {
      //   compress: {
      //     drop_console: true,
      //     drop_debugger: false,
      //   },
      // },
    },
  });
};
