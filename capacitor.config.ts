import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.inscaesc.app',
  appName: 'ISC',
  webDir: 'out',
  server: {
    url: 'https://inscae-section-chretienne.org',
    cleartext: false,
  },
};

export default config;
