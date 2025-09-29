const { withAndroidStyles } = require("@expo/config-plugins");

/**
 * Makes Android navigation + status bars translucent
 */
const withAndroidTransparentSystemBars = (config) => {
  return withAndroidStyles(config, (config) => {
    const styles = config.modResults;

    const appThemeStyle = styles?.resources?.style?.find(
      (style) => style.$.name === "AppTheme"
    );

    if (appThemeStyle && appThemeStyle.item) {
      const addItem = (name, value) => {
        const exists = appThemeStyle.item.find((i) => i.$.name === name);
        if (!exists) {
          appThemeStyle.item.push({ $: { name }, _: value });
        }
      };

      // Transparent navigation bar
      addItem("android:windowTranslucentNavigation", "true");
      // Transparent status bar
      addItem("android:windowTranslucentStatus", "true");
    }

    return config;
  });
};

module.exports = withAndroidTransparentSystemBars;
