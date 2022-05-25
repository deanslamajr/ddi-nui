"use strict";
/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  app_name: [`Remix-Backend_${process.env.ENV}`],
  license_key: process.env.NR_LICENSE,
};
