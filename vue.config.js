/* eslint-disable no-useless-escape */
module.exports = {
  pluginOptions: {
    quasar: {
      theme: 'mat',
      importAll: true,
    },
  },
  transpileDependencies: [
    /[\\\/]node_modules[\\\/]quasar-framework[\\\/]/,
  ],
};
