var credentials = require('./credentials.json');

var mysql = require("mysql");
credentials.host = 'ids';

var connection = mysql.createConnection(credentials);

connection.connect(function(err){
	if(err){
		console.log("Problems with MySQL: " + err);
	}
	else{
		console.log("Connected to Database.");
	}
});

//The number of tables for each database
var data = {};

//An object of db-boolean pair
var processed = {};

sql = "SHOW DATABASES";
connection.query(sql, function(err,rows, fields){
	if(err){
		console.log("Error looking up databases");
		connection.end();
	}
	else{
		processDBFs(rows);
	}
});

function processDBFs(dbfs){
	for(var index in dbfs){
		var dbf = dbfs[index].Database;
		var sql = 'SHOW TABLES IN ' + dbf;
		data[dbf] = Number.POSITIVE_INFINITY;
		connection.query(sql, (function(dbf){
			return function(err,tables,fields){
				if(err){
					console.log('Error finding tables in dbf '+ dbf);
					connection.end();
				}
				else{
					processTables(tables,dbf);
				}
			};
		})(dbf))
	}
}


function processTables(tables, dbf){
	data[dbf] = tables.length;
	processed[dbf] = false;

	for(var index in tables){
		var tableObj = tables[index];
		for(var key in tableObj){
			var table = tableObj[key];
			table = dbf + "." + table;
			var sql = 'DESCRIBE ' + table; 
			connection.query(sql, (function(table,dbf){
				return function(err, desc, fields){
					if(err){
						console.log('Error describing table '+ table);
					}
					else{
						processDescription(desc,table,dbf);
					}
				};		
			})(table,dbf))
		}
	}
}

function processDescription(desc,table, dbf){
	data[dbf]--;//Processed one table
	if(!processed[dbf]){
		processed[dbf] = true; 
		console.log('---|'+ dbf + '>');
	}

	console.log('.....|'+dbf+'.'+table+'>');
	desc.map(function(field){ // show the fields nicely
		console.log("\tFieldName: `"+field.Field+"` \t("+field.Type+")");
	});

	if(allZero(data)){
		connection.end();
	}
	
}

function allZero(object){
	allzero = true;
	for(obj in object){
		if(object[obj]!=0){
			allzero = false;
		}
	}
	return (allzero)
}
