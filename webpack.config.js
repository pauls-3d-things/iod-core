const webpack = require('webpack');

module.exports = {
    entry: ["./lib/ui/index.js"],
    output: {
        path: __dirname,
        filename: "dist/bundle.js"
    },
    devtool: "source-map",
    devServer: {
        contentBase: "dist/",
        port: 8081,
        proxy: {
            '/api': {
                target: 'http://localhost:8080/api/',
                secure: false
            }
        }
    },
    plugins: [
    ],
    module: {
        rules: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};