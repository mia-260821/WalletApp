import { Platform } from "react-native";

export const BACKEND_HOST = Platform.select({
  android: 'http://10.0.2.2',
  ios: 'http://localhost:8080/v1',
  default: 'http://localhost:8080/v1',
});
