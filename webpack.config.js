const path = require('path');

module.exports = {
    entry: './src/index.ts',
    mode: "development",
    module: {
        rules: [
        {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        ],
    },
    devServer: {
        open: true,
        host: '192.168.0.21'
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};