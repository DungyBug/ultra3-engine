const path = require('path');

module.exports = {
    entry: './example/index.ts',
    mode: "development",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(glsl|vs|fs)$/,
                loader: 'ts-shader-loader'
            }
        ]
    },
    devServer: {
        static: {
          directory: path.join(__dirname, './'),
        },
        port: 9000,
        open: true,
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};