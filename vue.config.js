const path = require('path');
const resolve = file => path.resolve(__dirname, file);

module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: '',
    indexPath: 'index.html',
    filenameHashing: true,
    lintOnSave: 'default',
    runtimeCompiler: false,
    productionSourceMap: true,
    crossorigin: undefined,
    integrity: false,
    configureWebpack: {},
    chainWebpack: config => {
        config.resolve.alias.set('/', resolve('public'))
            .set('@', resolve('src'))
            .set('@api', resolve('api'));

        const isExtracting = config.plugins.has('extract-css');
        if (isExtracting) {
            const langs = ['css', 'postcss', 'scss', 'sass', 'less', 'stylus'];
            const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
            for (const lang of langs) {
                for (const type of types) {
                    const rule = config.module.rule(lang).oneOf(type);
                    rule.uses.delete('extract-css-loader');
                    rule
                        .use('vue-style')
                        .loader('vue-style-loader')
                        .before('css-loader');
                }
            }
            config.plugins.delete('extract-css');
        }

        config.module.rule('vue').use('cache-loader');
        config.module.rule('vue').use('vue-loader');
        const imagesRule = config.module.rule('images');
        imagesRule.exclude.add(resolve('src/icons'));
        config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/);

        // add svg loader
        const svgRule = config.module.rule('svg');
        // clear before loaders
        svgRule.uses.clear();
        svgRule.exclude.add(/node_modules/);
        svgRule
            .test(/\.svg$/)
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]',
            });
    },
    css: {
        sourceMap: false,
        loaderOptions: {
            css: {},
            postcss: {
                plugins: [
                    require("postcss-pxtorem")(
                        //     {
                        //     rootValue: 37.5, // 换算的基数(设计图750的根字体为32)
                        //     selectorBlackList: [".van", ".my-van"],// 要忽略的选择器并保留为px。
                        //     propList: ["*"], //可以从px更改为rem的属性。
                        //     minPixelValue: 2 // 设置要替换的最小像素值。
                        // }
                        {
                            "rootValue": 37.5,
                            "propList": ["*"],
                            "selectorBlackList": [".van", ".my-van", ".van-icon"]
                        }
                    )
                ]
            }
        }
    },
    devServer: {
        host: '0.0.0.0',
        port: 8081,
        https: false,
        hot: true,
        proxy: {
            '/api': {
                target: 'http://192.168.1.30:4396',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            },
            '/napi': {
                target: 'http://192.168.10.5:9999/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/napi': '/'
                }
            }

        }
    }
}
