// index.js (Root Directory)
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import process from 'process';

// Force globals immediately
global.Buffer = Buffer;
global.process = process;
global.process.env = { ...global.process.env, NODE_ENV: __DEV__ ? 'development' : 'production' };

// Now register the Expo Router entry point
import "expo-router/entry";
