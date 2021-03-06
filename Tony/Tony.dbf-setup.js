var credentials = require('./credentials.json');

var mysql = require("mysql");
var Promise = require('bluebird');
var using = Promise.using;
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

credentials.host="ids";
var connection = mysql.createConnection(credentials);

var pool = mysql.createPool(credentials); // Setup the pool using our credentials.

// Overwrite getConnection that returns a Promise
var getConnection = function() {
  return pool.getConnectionAsync().disposer(
    function(connection){return connection.release();}
  );
};

// Tonation
// [SQL] :=> promise
var query=function(command) {
  return using(getConnection(), function(connection) {
    return connection.queryAsync(command);
  });
};

var endPool = function () {
  pool.end(function(err){});
}

exports.query = query;
exports.releaseDBF = endPool;
