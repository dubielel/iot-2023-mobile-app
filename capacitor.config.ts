/// <reference types="@codetrix-studio/capacitor-google-auth" />
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pl.edu.agh.iisi.iot.mdubiel',
  appName: 'IoT 2023 Mobile App',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      clientId:
        '171380463934-dp4f3eeus404gvi1bpgdfqditdaqv2mj.apps.googleusercontent.com',
      serverClientId:
        '171380463934-dp4f3eeus404gvi1bpgdfqditdaqv2mj.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
      androidClientId:
        '171380463934-dp4f3eeus404gvi1bpgdfqditdaqv2mj.apps.googleusercontent.com',
    },
  },
};

export default config;
