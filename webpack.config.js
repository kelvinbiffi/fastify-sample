const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.jsx', // Use .tsx extension
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Add .ts and .tsx extensions
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    open: true,
  }
};