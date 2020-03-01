const webpack = require("webpack"),
    path = require("path"),
    env = require("./utils/env"),
    CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin,
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    WriteFilePlugin = require("write-file-webpack-plugin"),
    MiniCssExtractPlugin = require('mini-css-extract-plugin');

const fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

const options = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    // the single js bundle used by the single page that is used for the popup, options and bookmarks
    index: path.join(__dirname, "src", "", "index.js"),

    // background scripts
    "js/backgroundScripts/background": path.join(__dirname, "src", "js/backgroundScripts", "background.js"),
    "js/backgroundScripts/messaging": path.join(__dirname, "src", "js/backgroundScripts", "messaging.js"),

    // content scripts that don't run on Steam
    "js/contentScripts/loungeBump": path.join(__dirname, "src", "js/content_scripts", "loungeBump.js"),
    "js/contentScripts/tradersBump": path.join(__dirname, "src", "js/content_scripts", "tradersBump.js"),
    "js/contentScripts/tradersAutoLogin": path.join(__dirname, "src", "js/content_scripts", "tradersAutoLogin.js"),

    // contents scripts that run on Steam pages
    "js/contentScripts/steam/announcements": path.join(__dirname, "src", "js/content_scripts/steam", "announcements.js"),
    "js/contentScripts/steam/apiKey": path.join(__dirname, "src", "js/content_scripts/steam", "apiKey.js"),
    "js/contentScripts/steam/friends": path.join(__dirname, "src", "js/content_scripts/steam", "friends.js"),
    "js/contentScripts/steam/group": path.join(__dirname, "src", "js/content_scripts/steam", "group.js"),
    "js/contentScripts/steam/openIDLogin": path.join(__dirname, "src", "js/content_scripts/steam", "openIDLogin.js"),
    "js/contentScripts/steam/sharedFile": path.join(__dirname, "src", "js/content_scripts/steam", "sharedFile.js"),
    "js/contentScripts/steam/webChat": path.join(__dirname, "src", "js/content_scripts/steam", "webChat.js"),
    "js/contentScripts/steam/inventory": path.join(__dirname, "src", "js/content_scripts/steam", "inventory.js"),
    "js/contentScripts/steam/marketListing": path.join(__dirname, "src", "js/content_scripts/steam", "marketListing.js"),
    "js/contentScripts/steam/market": path.join(__dirname, "src", "js/content_scripts/steam", "market.js"),
    "js/contentScripts/steam/tradeOffer": path.join(__dirname, "src", "js/content_scripts/steam", "tradeOffer.js"),
    "js/contentScripts/steam/tradeOffers": path.join(__dirname, "src", "js/content_scripts/steam", "tradeOffers.js")
  },
  output: {
    publicPath: '',
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          cache: true,
          emitWarning: true
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true,
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: new RegExp('\.(' + fileExtensions.join('|') + ')$'),
        loader: "file-loader?name=[name].[ext]",
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    extensions: fileExtensions.map(extension => ("." + extension)).concat([".jsx", ".js", ".css"])
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: false
    }),
    // copies assets that don't need bundling
    new CopyWebpackPlugin([
      "src/manifest.json",
      {
        from: "src/css",
        to: 'css/'
      },
      {
        from: "src/_locales",
        to: '_locales/'
      },
      {
        from: "src/images",
        to: 'images/'
      },
      {
        from: "src/js",
        to: 'js/'
      }
    ], { copyUnmodified: true }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
      filename: "index.html",
      chunks: ["index"]
    }),
    new WriteFilePlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ]
};

if (env.NODE_ENV === "development") {
  options.devtool = "cheap-module-source-map";
}

module.exports = options;
