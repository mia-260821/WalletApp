const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// This tells Metro to prefer 'require' (CommonJS) over 'import' (ESM)
// which removes the import.meta conflict
config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native'];

module.exports = config;
