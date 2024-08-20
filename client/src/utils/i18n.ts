import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "use-filters": "Use Filters for Advanced Search",
      filters: "Filters",
      "clear-filters": "Clear Filters",
      search: "Search",
      apply: "Apply",
      reset: "Reset",
    },
  },
  de: {
    translation: {
      "use-filters": "Verwenden Sie Filter für die erweiterte Suche",
      filters: "Filter",
      "clear-filters": "Filter löschen",
      search: "Suche",
      apply: "Anwenden",
      reset: "Zurücksetzen",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
