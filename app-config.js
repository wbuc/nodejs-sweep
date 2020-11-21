const assert = require("assert");
const dotenv = require("dotenv");
// read in the .env file
dotenv.config();
// capture the environment variables the application needs
const {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  ACCESS_TOKEN,
  ACCESS_TOKEN_SECRET,
  ENABLE_APP,
  TEST_APP
} = process.env;

// validate the required configuration information
assert(CONSUMER_KEY, "CONSUMER_KEY configuration is required.");
assert(CONSUMER_SECRET, "CONSUMER_SECRET configuration is required.");
assert(ACCESS_TOKEN, "ACCESS_TOKEN configuration is required.");
assert(ACCESS_TOKEN_SECRET, "ACCESS_TOKEN_SECRET configuration is required.");

// export the configuration information
module.exports = {
  twitter: {
    CONSUMER_KEY: CONSUMER_KEY,
    CONSUMER_SECRET: CONSUMER_SECRET,
    ACCESS_TOKEN: ACCESS_TOKEN,
    ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET,
  },
  ENABLE_APP: ENABLE_APP,
  TEST_APP: TEST_APP
};
