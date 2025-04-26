const webpack = require('webpack');


module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "fs": false,
          "tls": false,
          "net": false,
          "buffer": require.resolve("buffer/"),
        }
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
      ignoreWarnings: [
        {
          module: /@walletconnect/,
          message: /Failed to parse source map/,
        },
        {
          module: /@bitauth\/libauth/,
          message: /Failed to parse source map/,
        },
        {
          module: /@cashscript/,
          message: /Failed to parse source map/,
        },
        {
          module: /SignatureTemplate/,
          message: /Failed to parse source map/,
        },
        {
          module: /cashscript/,
          message: /Failed to parse source map/,
        },
        {
          module: /@bitcann\/core/,
          message: /Failed to parse source map/,
        },
      ],
    },
  },
}; 