
require('dotenv').config();
console.log("MAP KEY =", process.env.GOOGLE_MAPS_API_KEY);

export default ({ config }) => ({
  ...config,
  name: "Tripzy",
  slug: "tripzy",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "tripzy",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
  androidNavigationBar: {
    backgroundColor: "#ffffff",
    barStyle: "dark-content",
  },
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "cover",
    backgroundColor: "#2F80ED",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: "com.anonymous.tripzy",
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
    bundler: "metro",
  },
  "plugins": [
      [
        "@stripe/stripe-react-native",
        {
          "merchantIdentifier": "merchant.com.anonymous.tripzy",
          "enableGooglePay": true
        }
      ]
    ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "b5f4ef60-c9fc-47de-8664-4520cc2914a1",
    },
  },
});
