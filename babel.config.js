module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@': './src/',
        },
      },
    ],
  ],
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
