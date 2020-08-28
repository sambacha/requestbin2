// NodeJS dependencies
const dnsd = require("dnsd");
const ws = require("nodejs-websocket");
const crypto = require("crypto");
const fs = require("fs");

// Configuration & Custom module
const config = require("./config");
const persistence = require("./persistence");

const map = {};

if (typeof String.prototype.startsWith !== "function") {
  String.prototype.startsWith = function (str) {
    return this.substring(0, str.length) === str;
  };
}

if (typeof String.prototype.endsWith !== "function") {
  String.prototype.endsWith = function (str) {
    return this.substring(this.length - str.length, this.length) === str;
  };
}

function bin2hex(d) {
  let hex;
  let i;

  if (d == "") {
    return "00";
  }

  let result = "";
  for (i = 0; i < d.length; i++) {
    hex = d.charCodeAt(i).toString(16);
    result += `0${hex}`.slice(-2);
  }

  return result;
}

function logData(message) {
  if (config.logFile) {
    fs.appendFile(
      config.logFile,
      `[${new Date().toString()}] ${message}`,
      (err) => {
        if (err) {
          console.error(`Failed to log message ! ${err}`);
        }
      }
    );
  }
}

const server = ws
  .createServer((conn) => {
    try {
      let token;
      let master;

      crypto.randomBytes(20, (err, buffer) => {
        // If the token variable is already defined, this means
        // a restore as already happened.
        if (token) {
          return;
        }

        try {
          token = buffer.toString("hex").substr(0, 20);
          master = token;
          // master = buffer.toString('hex').substr(20, 20);

          map[token] = {
            connection: conn,
            buffer: "",
          };

          conn.sendText(
            JSON.stringify({
              type: "token",
              master,
              data: token,
            })
          );

          persistence.createIdentity(master, token);

          logData(
            `Token assignment '${token}' with IP '${conn.socket.remoteAddress}' \n`
          );
        } catch (e) {}
      });

      conn.on("text", (data) => {
        try {
          data = JSON.parse(data);

          // When the attribute text is defined, the client is sending data for the in/out request.
          if (data.text) {
            if (map[token].buffer.length + data.text.length > 2048) {
              map[token].connection.sendText(
                JSON.stringify({
                  type: "error",
                  data: "Maximum buffering is 2048 bytes.",
                })
              );
              return;
            }
            map[token].buffer += data.text;
          }

          // When the attribute restore is defined, the client is trying to restore the previously
          // saved data from a master token.
          if (data.restore && data.master) {
            persistence.restoreFromMaster(data.master, (data) => {
              // If the restore was succesful we add the information to the map so
              // that the connection can receive real-time data.
              if (!data.err) {
                token = data.subdomain;

                map[token] = {
                  connection: conn,
                  buffer: "",
                };
              }

              data.type = "restore";
              conn.sendText(JSON.stringify(data));
            });
          }
        } catch (e) {}
      });

      conn.on("close", (code, reason) => {
        try {
          delete map[token];
        } catch (e) {}
      });
    } catch (e) {}
  })
  .listen(config.websocketPort);

dnsd
  .createServer((req, res) => {
    try {
      let domain = res.question[0].name;

      const domainWithPrefixStandard =
        config.prefixes.standard + config.targetDomain;
      const domainWithPrefixIn = config.prefixes.in + config.targetDomain;
      const domainWithPrefixOut = config.prefixes.out + config.targetDomain;

      if (domain.endsWith(domainWithPrefixStandard)) {
        // Dissect the request domain name to extract the data and generated id
        // Format looks like : [data].[id].d.freighttrust.net

        domain = domain.substring(
          0,
          domain.length - domainWithPrefixStandard.length
        );
        parts = domain.split(".");
        id = parts[parts.length - 1];
        content = parts.slice(0, parts.length - 1).join(".");
        current_timestamp = new Date().getTime();
        content_save = JSON.stringify({
          time: current_timestamp,
          ip: req.connection.remoteAddress,
          content,
        });

        // Persistence to allow restore from the UI.
        persistence.storeSubdomainRequest(id, content_save);

        // Send real time data if the client is still connected.
        if (map.hasOwnProperty(id) && map[id]) {
          map[id].connection.sendText(
            JSON.stringify({
              type: "request",
              data: content_save,
            })
          );
        }

        logData(
          `Data request : ${domain} (IP : ${req.connection.remoteAddress})\n`
        );
      } else if (domain.endsWith(domainWithPrefixIn)) {
        // Dissect the request domain name to extract the data and generated id
        // Format looks like : [data].[id].i.freighttrust.net
        domain = domain.substring(0, domain.length - domainWithPrefixIn.length);
        parts = domain.split(".");
        id = parts[parts.length - 1];

        logData(
          `Input request : ${domain} (IP : ${req.connection.remoteAddress})\n`
        );

        // In and out request are only supported in real-time, no restore is done here.
        if (map.hasOwnProperty(id) && map[id]) {
          buffer = map[id].buffer;

          res.answer.push({
            name: res.question[0].name,
            type: "CNAME",
            data: `${bin2hex(buffer.substr(0, 30))}.${bin2hex(
              buffer.substr(30, 30)
            )}${domainWithPrefixOut}`,
            ttl: 0,
          });
          res.end();

          map[id].buffer = buffer.substr(60);
          map[id].connection.sendText(
            JSON.stringify({
              type: "dataconsumed",
              data: map[id].buffer.length,
            })
          );
          return;
        }
      } else {
        // Unrecognized request (it's usually DNS scanner that looks for open DNS).
        logData(
          `No match ! ${domain} (IP : ${req.connection.remoteAddress})\n`
        );
      }

      // Always return localhost
      res.end("127.0.0.1");
    } catch (e) {}
  })
  .listen(53, "0.0.0.0");

console.log("Started !");
