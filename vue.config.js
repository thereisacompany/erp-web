module.exports = {
    pluginOptions: {
        i18n: {
            locale: 'zh',
            fallbackLocale: 'zh',
            localeDir: 'locales',
            enableInSFC: false
        }
    },
    devServer: {
        port: 8080,
        proxy: {
            '/jshERP-boot': {
                target: 'http://34.80.85.84:10000',
                ws: false,
                changeOrigin: true
            },
        }
    },
    configureWebpack: {
        // 設置模式為 development
        mode: 'development',
        // 設定 source map 為 'eval-source-map' 以利於調試
        devtool: 'eval-source-map',
    },
}
