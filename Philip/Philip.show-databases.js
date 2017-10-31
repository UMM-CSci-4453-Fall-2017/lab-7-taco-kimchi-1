mysql = require('mysql');
dbf=require("./Philip.dbf-setup.js");

var getDatabases = function(){
	var sql = "SHOW DATABASES";
	return dbf.query(mysql.format(sql));
}

var processDBFs = function(queryResults){
	dbfs = queryResults;
	return(dbfs);
}

dbf=getDatabases().then(processDBFs).then(function(results){
	console.log(results)
}).then(dbf.releaseDBF);
