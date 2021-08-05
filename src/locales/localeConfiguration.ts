const localeData = require("./data.json");

export const getLocalizedResources = (language: string) => {
  const messages = localeData[language] || localeData.en;

  return {
    messages,
    language,
  };
};
