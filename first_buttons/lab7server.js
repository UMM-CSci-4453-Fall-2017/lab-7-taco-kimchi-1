DBF=require('./dbf-setup.js');
Promise=require('bluebird');
mysql=require('mysql');

var express=require('express'),
app = express(),
port = process.env.PORT || 1337;

var buttons=[{"buttonID":1,"left":10,"top":70,"width":100,"label":"hotdogs","invID":1},{"buttonID":2,"left":110,"top":70,"width":100,"label":"hambugers","invID":2},{"buttonID":3,"left":210,"top":70,"width":100,"label":"bannanas","invID":3},{"buttonID":4,"left":10,"top":120,"width":100,"label":"milkduds","invID":4}]; //static buttons

var getDatabases=function(db){//Returns a promise that can take a handler ready to process the results
  var sql = "SELECT * from Tony.till_buttons";
  return db.query(mysql.format(sql)); //Return a promise
}

app.use(express.static(__dirname + '/public')); //Serves the web pages

app.get("/buttons",function(req,res){ // handles the /buttons API
  var dbf=getDatabases(DBF)
  .then(function (results) {
    res.send(results);
  })
  // .then(DBF.releaseDBF)
  .catch(function(err){console.log("DANGER:",err)});
});

app.listen(port);
