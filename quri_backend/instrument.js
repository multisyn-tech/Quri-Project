// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://cf37793e66dbe264a6eba1ae0fb1915d@o4509530447675392.ingest.de.sentry.io/4509563994832976",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});

module.exports = Sentry; 
