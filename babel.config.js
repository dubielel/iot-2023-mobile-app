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
};
