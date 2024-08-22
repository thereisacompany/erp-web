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
    configureWebpack: () => {
        if (process.env.VUE_APP_ENV === 'production') {
            // 生产环境
            return {
                mode: 'production',
                devtool: 'source-map', // 生产环境建议使用 source-map
            };
        } else {
            // 开发环境
            return {
                mode: 'development',
                devtool: 'eval-source-map', // 开发环境使用 eval-source-map 方便调试
            };
        }
    }
}
