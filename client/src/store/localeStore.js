import { reactive } from "vue";

import en from "@/locales/en.json";
import pl from "@/locales/pl.json";
import nl from "@/locales/nl.json";
import es from "@/locales/es.json";

export default reactive({
  supportedLocales: ["en", "pl", "nl", "es"],
  locale: "en",
  localeKeys: en,

  loadLocaleFromUrl() {
    const locale = window.location.pathname.split("/")[1];
    this.loadLocale(locale);
  },
  overrideLocale(locale) {
    this.loadLocale(locale);
  },
  loadLocale(locale) {
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
      case "nl":
        this.localeKeys = nl;
        break;
      case "es":
        this.localeKeys = es;
        break;
      default:
        this.localeKeys = en;
    }
    if (window.location.pathname.split("/")[1] !== this.locale) {
      const path = window.location.pathname.split("/");
      path[1] = this.locale;
      window.history.pushState({}, "", path.join("/"));
    }
    console.log("Locale Updated:", this.locale);
  },

  toggleNextLocale() {
    const currentIndex = this.supportedLocales.indexOf(this.locale);
    const nextIndex = (currentIndex + 1) % this.supportedLocales.length;
    this.loadLocale(this.supportedLocales[nextIndex]);
  },
});
