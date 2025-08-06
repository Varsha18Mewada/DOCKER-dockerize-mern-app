// eslint-disable-next-line no-undef
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-react', // Adds support for JSX
  ],
  plugins: ['babel-plugin-transform-vite-meta-env'],
};
