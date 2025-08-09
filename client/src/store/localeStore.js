import { reactive } from "vue";

import en from "@/locales/en.json";

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
  async loadLocale(locale) {
    if (!this.supportedLocales.includes(locale)) {
      this.locale = "en";
      console.warn("Locale not supported");
      return;
    }

    const messages = await import(`@/locales/${locale}.json`);
    this.localeKeys = messages.default;

    this.locale = locale;
    console.log("Locale Updated:", this.locale);
  },

  toggleNextLocale() {
    const currentIndex = this.supportedLocales.indexOf(this.locale);
    const nextIndex = (currentIndex + 1) % this.supportedLocales.length;
    this.loadLocale(this.supportedLocales[nextIndex]);
  },
});
