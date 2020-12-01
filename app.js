"use strict";

const wsjsapi = require("./wsjsapi");

class Client {
  connection = null;
  autocommit = true;

  connect(cb) {
    this.connection = new wsjsapi.Exasol(
      this.url,
      this.username,
      this.password,
      this.autocommit,
      (session) => {
        cb(null, session);
      },
      (error) => {
        cb(error, null);
      }
    );
  }

  disconnect() {
    this.connection.disconnect();
  }

  resultToJSON(resultSet) {
    let data = [];
    for (let rowIndex = 0; rowIndex < resultSet.data[0].length; rowIndex++) {
      let newRow = {};
      for (
        let columnIndex = 0;
        columnIndex < resultSet.columns.length;
        columnIndex++
      ) {
        newRow[resultSet.columns[columnIndex].name] =
          resultSet.data[columnIndex][rowIndex];
      }
      data.push(newRow);
    }
    return data;
  }

  execute(sqlStatement, cb) {
    if (!this.connection) {
      cb("ERROR: Not Connected - unable to execute!", null);
    } else {
      this.connection.com(
        { command: "execute", sqlText: sqlStatement },
        (response) => {
          // Query
          if (response.results[0].resultSet) {
            const resultSet = response.results[0].resultSet;
            if (response.results[0].resultSet.resultSetHandle) {
              this.connection.fetch(
                resultSet,
                0,
                resultSet.numRows,
                (result) => {
                  cb(null, this.resultToJSON(result));
                }
              );
            } else cb(null, this.resultToJSON(resultSet));
          } // Non-query statement
          else {
            cb(null, null);
          }
        },
        (error) => {
          cb(error, null);
        }
      );
    }
  }

  constructor(username, password, url, port, autocommit) {
    this.url = `ws://${url}:${port}`;
    this.username = username;
    this.password = password;
    if (!autocommit) this.autocommit = false;
  }
}

module.exports = {
  createClient: function (
    username,
    password,
    url,
    port = 8563,
    autocommit = true
  ) {
    return new Client(username, password, url, port, autocommit);
  },
};
