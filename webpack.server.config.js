const path = require('path');

module.exports = {
    entry: './src/server/server.ts',
    mode: "development",
    target: "node",
    module: {
        rules: [
        {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist'),
    },
};