import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "dev.mitchinson.budgetquickentry",
  appName: "\x15Budget Quick Entry",
  webDir: "build",
  server: {
    androidScheme: "https",
  },
  bundledWebRuntime: false,
};

export default config;
