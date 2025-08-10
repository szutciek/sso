import { reactive } from "vue";

import en from "@/locales/en.json";

export default reactive({
  supportedLocales: ["en", "pl", "nl", "es", "zh"],
  locale: "en",
  localeKeys: en,
  configuredLocale: false,

  configureLocale() {
    if (this.configuredLocale) return;
    let locale = window.location.pathname.split("/")[1];
    if (!this.supportedLocales.includes(locale)) {
      locale = this.loadLocaleStorage();
    }
    this.locale = locale;
    this.loadLocale(locale);
    this.configuredLocale = true;
  },
  overrideLocale(locale) {
    this.loadLocale(locale);
  },
  async loadLocale(locale) {
    if (!this.supportedLocales.includes(locale)) {
      this.locale = "en";
      console.warn("Locale not supported");
      return;
    }

    const messages = await import(`@/locales/${locale}.json`);
    this.localeKeys = messages.default;

    this.locale = locale;
    this.saveLocaleStorage(this.locale);
    console.log("Locale Updated:", this.locale);
  },

  toggleNextLocale() {
    const currentIndex = this.supportedLocales.indexOf(this.locale);
    const nextIndex = (currentIndex + 1) % this.supportedLocales.length;
    this.loadLocale(this.supportedLocales[nextIndex]);
  },

  saveLocaleStorage(locale) {
    window.localStorage.setItem("lastLocale", locale);
  },

  loadLocaleStorage() {
    const loaded = window.localStorage.getItem("lastLocale");
    return loaded ? loaded : "en";
  },
});
