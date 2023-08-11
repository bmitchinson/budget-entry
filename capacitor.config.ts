import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "dev.mitchinson.budgetquickentry",
  appName: "Budget Entry",
  webDir: "build",
  server: {
    androidScheme: "https",
  },
  bundledWebRuntime: false,
  ios: {
    scheme: "Budget Entry",
  },
};

export default config;
