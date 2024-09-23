module.exports = {
  devServer: {
    proxy: {
      "/api": { target: "http://localhost:4771" },
      "/assets": { target: "http://localhost:4771" },
    },
  },
  pwa: {
    name: "Kanapka SSO",
    short_name: "Kanapka SSO",
    theme_color: "#246bfd",
    icons: [
      {
        src: "./img/logo-round192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "./img/logo-round512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "./img/logo-round192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "./img/logo-round512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    start_url: ".",
    display: "standalone",
    background_color: "#ffffff",

    msTileColor: "#246bfd",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black-translucent",

    workboxOptions: {
      skipWaiting: true,
    },
  },
};
