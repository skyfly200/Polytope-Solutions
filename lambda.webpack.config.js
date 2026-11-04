// Extra webpack config for netlify-lambda (see build:lambda in package.json).
// netlify-lambda uses webpack 4, which cannot parse the modern syntax shipped in
// @neondatabase/serverless. Leaving it external loads it from node_modules at
// runtime, and Netlify packages the dependency with the function.
module.exports = {
  externals: {
    "@neondatabase/serverless": "commonjs @neondatabase/serverless",
  },
};
