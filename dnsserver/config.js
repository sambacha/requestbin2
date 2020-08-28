/** @format */

// The domain name on which you have configured your DNS setup.
const targetDomain = 'freighttrust.net'

// Websocket URI that the client will use to connect
const websocketUrl = 'ws://dns.freighttrust.net:8080/dnsbin'

// Subdomain used for the service.
const prefixes = {
  standard: '.d.',
  in: '.i.',
  out: '.o.',
}

// Where the logs are stored, use undefined or null if you don't want any log.
const logFile = 'log.txt'

// Port used for the websocket communication. If you wish to change this value to
// something else than the default 8888, make sure to change it in the index.html
// page too.
const websocketPort = 8080

// Use ":memory:" if you don't want to store data on disk (recommended when testing)
// Otherwise specify a filename
const sqliteDatabase = ':memory:'

// Maximum of entry stored in the database. Once the limit is reached older entry
// will be deleted.
const sqliteMaxEntry = 100000

// Polyfill for when this file is loaded in the browser.
if (typeof window !== 'undefined' && !window.exports) {
  exports = {}
}

exports.targetDomain = targetDomain
exports.prefixes = prefixes
exports.logFile = logFile
exports.websocketPort = websocketPort
exports.sqliteDatabase = sqliteDatabase
exports.websocketUrl = websocketUrl
