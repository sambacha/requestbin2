const sqlite3 = require("sqlite3");
const fs = require("fs");
const config = require("./config");

const db = new sqlite3.Database(config.sqliteDatabase);

// Make sure the table are initialized
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS requests (master TEXT, data TEXT, timestamp INTEGER); "
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS identity (master TEXT, subdomain TEXT, timestamp INTEGER); "
  );
  db.run("CREATE INDEX IF NOT EXISTS req_master ON requests (master); ");
  db.run("CREATE INDEX IF NOT EXISTS ident_master ON identity (master); ");
  db.run(
    "CREATE INDEX IF NOT EXISTS ident_subdomain ON identity (subdomain); "
  );
});

function storeSubdomainRequest(subdomain, data) {
  db.each(
    "SELECT master FROM identity WHERE subdomain = ?; ",
    subdomain,
    (err, row) => {
      if (err) {
        return;
      }

      if (row.master) {
        db.run(
          "INSERT INTO requests VALUES (?, ?, ?); ",
          row.master,
          data,
          new Date().getTime()
        );
      }
    }
  );
}

function createIdentity(master, subdomain) {
  db.run(
    "INSERT INTO identity VALUES (?, ?, ?); ",
    master,
    subdomain,
    new Date().getTime()
  );
}

function restoreFromMaster(master, callback) {
  db.all(
    "SELECT subdomain FROM identity WHERE master = ?",
    master,
    (err, rows) => {
      if (err || rows.length == 0) {
        callback({ err: "Master token not found !", data: [] });
        return;
      }

      const { subdomain } = rows[0];

      db.all(
        "SELECT data FROM requests WHERE master = ? ORDER BY timestamp ASC",
        master,
        (err, rows) => {
          if (err) {
            callback({
              err: `Error while finding existing request. ${err}`,
              data: [],
            });
            return;
          }

          callback({ err: null, data: rows, subdomain });
        }
      );
    }
  );
}

exports.storeSubdomainRequest = storeSubdomainRequest;
exports.createIdentity = createIdentity;
exports.restoreFromMaster = restoreFromMaster;
