# Nodejs-Exasol

This module is intended as a light weight connector for the Exasol database, allowing extract as well as DML operations (update, insert etc.)

## Usage

```
const exalib = require("nodejs-exasol");
const client = test.createClient("MyUsername", "MyPassword", "127.0.0.1");
```

### Connect and Disconnect

```
client.connect((error, session) => {
    if (error) {
        console.log(error);
    } else {
        console.log("connected!");
        // Do stuff...
    }

    // Optional disconnect if/when client is no longer needed
    client.disconnect();
});
```

### Select / DML Operations

```
const query = "select * from dual;";
client.execute(query, (error, result) => {
    if (error) {
        console.log(error);
    } else {
        console.log(result);
    }
});
```


## References
Based on EXASOL websocket-api: https://github.com/exasol/websocket-api

Inspired by exasol-websocket-api: https://github.com/wvezey/websocket-api