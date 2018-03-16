var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './documentation/js',
    output: {
        path: path.resolve(__dirname, './documentation/dist/js'),
        publicPath: './documentation/dist/js',
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    'scss': 'vue-style-loader!css-loader!sass-loader',
                    'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                }
            }
        },{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',
};
