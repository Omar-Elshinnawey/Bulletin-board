const webpack = require('webpack'),
    path = require('path');

var config = {
    context: path.resolve(__dirname, './public'),

    entry: {
        bundle: './ts/main.ts',
        vendor: './ts/vendor.ts'
    },

    output: {
        filename: './public/js/[name].js'
    },

    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },

    module: {
        loaders: [{
            test: /\.ts?$/,
            loaders: ['awesome-typescript-loader'],
            exclude: /node_modules/
        }]
    },

    plugins: [
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.resolve(__dirname, './public/ts'), {}
        ),

        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['bundle', 'vendor']
        })
    ]
}

module.exports = config;