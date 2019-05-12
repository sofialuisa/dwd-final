var express = require('express');
var app = express();
var bodyParser = require("body-parser");
const url = require('url')
const path = require('path')
var mustacheExpress = require('mustache-express');
var { Client } = require('pg');
var client = new Client({database: 'phlocal'});
client.connect();
if (process.env.DATABASE_URL){
  client = new Client({connectionString: process.env.DATABASE_URL, ssl: true});
} else {
  client = new Client({database: 'postgresql-clean-62138'});
}

//var request = require('request');
const PORT = process.env.PORT || 8000;
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname);


app.get('/', function(req, res){
      //res.sendFile(path.join(__dirname + '/index.html'));
      res.render('index');
});


app.post('/ph',function (req, res3){
  var myText = req.body.mytext;
//  res3.sendFile(path.join(__dirname + '/index.html'));
    if (myText === undefined){
      res3.sendFile(path.join(__dirname + '/index.html'));
    }else{
      client.query('INSERT INTO usernames (message) VALUES (\'' + myText + '\')', function (error, results) {
      if (error) throw error;
    //res3.sendFile(path.join(__dirname + '/ph.html'));
  });
      client.query('SELECT * FROM usernames', (err, res2) => {
        if (err) throw (err);
        // for (let row of res2.rows){
        //   console.log(JSON.stringify(row));
        // }
        let lastRowIndex = res2.rows.length-1;
        let thisRow = res2.rows[lastRowIndex];
        //console.log(howMany);
        //console.log("con stringy" + JSON.stringify(thisRow));
        let usernameArray = thisRow;
        console.log(usernameArray);
        res3.render('ph',{
          usernameArray
        });
      });
}
});

app.listen(PORT, function() {
});
