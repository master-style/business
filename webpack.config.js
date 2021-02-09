
const path = require('path');
const Webpack = require('webpack');
const glob = require('globby');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const package = require('./package.json');

module.exports = env => {
    const entryGlob = [
        'src/**/index.{ts,js}'
    ];
    
    return {
        entry: glob.sync(entryGlob).reduce((entrypoint, eachPath) => {
            const parsePath = path.parse(path.relative(path.join('./src'), eachPath));
            const filename = path.join(parsePath.dir, parsePath.name);
            entrypoint[filename] = [path.resolve(eachPath)];
            return entrypoint;
        }, {}),
        externals: Object.keys(package.dependencies),
        mode: 'production',
        resolve: {
            extensions: ['.js', '.ts'],
            modules: [path.resolve('./src'), path.resolve('./node_modules')]
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve('./tsconfig.json')
                    }
                },
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                babelrc: true
                            }
                        }
                    ]
                }
            ]
        },
        output: {
            path: path.resolve('./dist'),
            libraryTarget: 'umd'
        },
        plugins: [
            new CleanWebpackPlugin(),
            new Webpack.ProgressPlugin(),
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                openAnalyzer: false
            })
        ]
    }
}