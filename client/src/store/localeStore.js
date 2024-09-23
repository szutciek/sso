import { reactive } from "vue";

import en from "@/locales/en.json";
import pl from "@/locales/pl.json";

export default reactive({
  supportedLocales: ["en", "pl"],
  locale: "en",
  localeKeys: en,

  loadLocale() {
    const locale = window.location.pathname.split("/")[1];
    if (this.supportedLocales.includes(locale)) {
      this.locale = locale;
    }
    switch (this.locale) {
      case "en":
        this.localeKeys = en;
        break;
      case "pl":
        this.localeKeys = pl;
        break;
      default:
        this.localeKeys = en;
    }
  },
  overrideLocale(locale) {
    this.locale = locale;
  },
});
