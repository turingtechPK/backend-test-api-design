var http = require('http');
const axios = require('axios');
const Octonode = require('octonode');
var mysql = require('mysql');

function insert_rec(repo_name, username, contributions){

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "test1"
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT INTO contrib (repo_name, username, contributions) VALUES ('"+repo_name+"', '"+username+"', '"+contributions+"')";
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
    });
}

function getContributers(reponame){
    console.log(reponame);
    const client = Octonode.client('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');
    const ghrepo = client.repo('facebook/'+reponame);


    ghrepo.contributors((err, data, headers) => {
        if (err) {

            console.error(err);
        } else {
            for (var i = 0; i < data.length; i++){
                insert_rec(reponame, data[i]['login'], data[i]['contributions'])




            }
        }
    });




}

async function getRepo(){

    const repolist = await axios.get('https://api.github.com/orgs/facebook/repos')
    return repolist.data
}








repolist = getRepo()
repolist.then(function (result) {
    for (i=0; i<result.length;i++){
        getContributers(result[i]['name'])
    }
})

