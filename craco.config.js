module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "fs": false,
          "tls": false,
          "net": false,
        }
      },
      ignoreWarnings: [
        {
          module: /@walletconnect/,
          message: /Failed to parse source map/,
        },
      ],
    },
  },
}; 