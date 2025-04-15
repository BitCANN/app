module.exports = {
  // ... other config
  ignoreWarnings: [
    {
      module: /@walletconnect/,
      message: /Failed to parse source map/,
    },
  ],
}; 