const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3001/",
    setupNodeEvents(on, config) {
      // implement node event listeners here

      // Importar variáveis do .env
      config.env = {
        ...process.env
      };
      return config;
    },
  },
});
