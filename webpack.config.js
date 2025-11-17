const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',
  devtool: argv.mode === 'production' ? false : 'inline-source-map',

  entry: {
    ui: './src/app/index.tsx',
    code: './src/plugin/index.ts',
  },

  watch: argv.mode === 'development',
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
    ignored: /node_modules/,
  },

  module: {
    rules: [
      // TypeScript loader
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // CSS loader - inline styles for Figma compatibility
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'singletonStyleTag',
              insert: 'head',
            },
          },
          'css-loader',
          'postcss-loader'
        ],
      },
      // SASS loader
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: argv.mode === 'production',
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/app/ui.html',
      filename: 'ui.html',
      chunks: ['ui'],
      inject: 'body',
      scriptLoading: 'blocking',
    }),
    new HtmlInlineScriptPlugin({
      htmlMatchPattern: [/ui.html/],
      scriptMatchPattern: [/ui.js$/],
    }),
  ],

  // Disable chunk splitting for Figma plugins
  optimization: {
    splitChunks: false,
  },
});
