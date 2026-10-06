// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app';

export default defineConfig(() => {
  return {
    // App boot files
    boot: [],

    // Global styles
    css: ['app.scss'],

    // Quasar extras
    extras: ['roboto-font', 'material-icons'],

    build: {
      target: {
        // browser: 'baseline-widely-available',
        // node: 'node22'
      },

      typescript: {
        strict: true,
        vueShim: true,
        // extendTsConfig (tsConfig) {}
      },

      // ALT uses explicit Vue Router routes in src/router/routes.ts
      filenameBasedRouting: false,

      // Use history mode for clean routes such as:
      // /login
      // /register
      // /
      // /anime/:id
      // /anime/create
      // /anime/:id/edit
      vueRouterMode: 'history',

      // publicPath: '/',
      // vueRouterBase: '/',
      // define: {},
      // defineEnv: {},
      // ignorePublicFolder: true,
      // minify: false,
      // distDir: 'dist',

      vitePlugins: [
        [
          'vite-plugin-checker',
          {
            vueTsc: true,
            eslint: {
              lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{ts,js,mjs,cjs,vue}"',
              useFlatConfig: true,
            },
          },
          { server: false },
        ],
      ],
    },

    devServer: {
      // vueDevtools: true,
      // https: true,
      open: true,
    },

    framework: {
      config: {},

      plugins: [],
    },

    animations: [],

    ssr: {
      prodPort: 3000,
      middlewares: ['render'],
    },

    ssg: {
      // onSsgRendererError: 'abort',
      // ssgRendererConcurrency: 1,
      // ssgRendererRetryCount: 0,
      // ssgRendererRetryDelay: 1000,
      // ssgRendererDirectoryIndexes: true,
      // error404HtmlFilename: '404.html',
      // clientSideRenderingHtmlFilename: 'csr.html',
      // clientSideRenderingRoutes: [],
      // noPreloadTagRoutes: [],
      // extendSSGRendererConf (rolldownConf) {},
      // extendSSGManifestJson (json) {},
      // manualStoreSerialization: true,
      // manualStoreSsrContextInjection: true,
      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,
      // prodScriptNamedExport: false,
    },

    pwa: {
      workboxMode: 'GenerateSW',
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,
      bundler: 'packager',

      packager: {},

      builder: {
        appId: 'my-anime-list',
      },
    },

    bex: {
      extraScripts: [],
    },
  };
});
