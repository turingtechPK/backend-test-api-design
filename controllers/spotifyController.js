const axios = require('axios');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const spotifyController = {
    newContributors: async(req,res,next) => {
        res.status(200).json(await getRepos());
    },
}

async function getRepos(){
    let response = await axios.get('https://api.github.com/users/spotify/repos');
    let repos = response.data;
    let results = [];
    for (let index = 0; index < repos.length; index++) {
        const repo = repos[index];
        let obj = {}
        obj.org = "Spotify";
        obj.repository = repo.name;
        obj.newContributors = await parser(repo.name);
        results.push(obj);
    }
    return results;
} 
 
async function parser(name){
    let uniqueEmail = new Set();
    let uniqueMonth = new Map();
    let response = await axios.get('https://api.github.com/repos/spotify/'+name+'/commits');
    let data = response.data;
    for (let index = data.length-1; index >= 0; index--) {
        const element = data[index];
        if(!(uniqueEmail.has(element.commit.author.email))){
            uniqueEmail.add(element.commit.author.email);
            let parsedDate = parseDate(element.commit.author.date);
            if(uniqueMonth.has(parsedDate)){
                uniqueMonth.set(parsedDate,uniqueMonth.get(parsedDate)+1)
            }else{
                uniqueMonth.set(parsedDate,1);                
            }
        }
    }
    const obj = Object.fromEntries(uniqueMonth); 
    return obj;
}

function parseDate(stringDate){
    const theDate = new Date(stringDate);
    return(months[theDate.getMonth()]+" "+theDate.getFullYear());
}

module.exports = { spotifyController }


