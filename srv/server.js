"use strict";
const cds = require("@sap/cds");
const proxy = require("@cap-js-community/odata-v2-adapter");
proxy.singleton();
cds.on("bootstrap", (app) => app.use(proxy()));
module.exports = cds.server;