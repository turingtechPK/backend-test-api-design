var express = require('express');
var app = express();
const mysql = require('mysql')



app.get('/:org/:repository', function(req, res){


  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test1'
  })

  connection.connect()


  query = 'SELECT `repo_name`, `username` AS Contributors FROM `contrib` WHERE `repo_name` =\''+req.params.repository+'\'';
  connection.query( query, (err, rows, fields) => {
    if (err) throw err
    obj = {
      "org":  req.params.org,
      "repository": req.params.repository,
      ///"newContributors":
    };

    contrib_obj = {}
    for (i=0; i<rows.length; i++){
      contrib_obj[i] =  rows[i]['Contributors']

    }
    obj['Contributors'] = contrib_obj

    console.log(obj)
    res.send(obj)

  })

  connection.end()


});
app.listen(8080);