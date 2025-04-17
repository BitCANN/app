module.exports = {
  // ... other config
  ignoreWarnings: [
    {
      module: /@walletconnect/,
      message: /Failed to parse source map/,
    },
    {
      module: /cashscript/,
      message: /Failed to parse source map/,
    },
    {
      module: /SignatureTemplate/,
      message: /Failed to parse source map/,
    },
  ],
}; 