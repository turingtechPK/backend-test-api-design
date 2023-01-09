// imported required package(s) & utility file(s)...
const { https, fetch, parseHeaderLink, moment, dotenv } = require("../utils/packages");
const { generateOptions } = require('../utils/set-header-options');
const { constants } = require("../utils/constants");
dotenv.config();

// model(s)
const Repository = require("../models/repository");
const Contributor = require("../models/newContributor");

// this function will first get all the repositories of an specific user and then
// extract the repository details and store them in the database... 
exports.getAllRepositories = async(req, res) => {
    try {
        const username = req.params.username;
        let response = await fetch(`https://api.github.com/users/${username}/repos?type=owner&sort=created&direction=asc&page=1&per_page=100`, {
          method: "GET",
          headers: {
            'User-Agent': constants.userAgent,
            'Authorization': process.env.GITHUB_ACCESS_TOKEN
          },
        });

        // handling the rate limit errors...
        if(response.message.includes(constants.rateLimitExceeded)) {
            res.status(404).send({message: constants.rateLimitExceededMessage});
        } else {
            // console.log(response.headers.raw())
            let links = response.headers.raw().link;
            let repositories = await response.json();
            let paginationLinks = parseHeaderLink(links[0]);
            let nextLink = paginationLinks?.next?.url;
            let data;
            
            while(nextLink) {
                response = await fetch(nextLink, {  
                    method: "GET",
                    headers: {
                        'User-Agent': constants.userAgent,
                        'Authorization': process.env.GITHUB_ACCESS_TOKEN
                    },
                });
                paginationLinks = parseHeaderLink(response.headers.raw().link[0]);
                data = await response.json();
                nextLink = paginationLinks?.next?.url;
                repositories = repositories.concat(data);
            }
    
            let filteredData = [], repoDetails = {};
    
            // extracting the required attributes from the response and storing
            // them in the database...
            // console.log(repositories);
            repositories.forEach(async(repo) => {
                repoDetails.name = repo.name;
                repoDetails.full_name = repo.full_name;
                repoDetails.description = repo.description;
                repoDetails.default_branch = repo.default_branch;
                repoDetails.private = repo.private;
                repoDetails.owner = {
                    login: repo.owner.login,
                    type: repo.owner.type
                };
                repoDetails.created_at = repo.created_at;
                repoDetails.commits_url = repo.commits_url;
                repoDetails.contributors_url = repo.contributors_url;
                filteredData.push(repoDetails);
    
                await Repository.create(repoDetails, (err, repo) => {
                    if(err) {
                        res.status(500).send({message: err.message});
                    }
                    repoDetails = {};
                });
            });
    
            res.status(200).send({message: "REPOSITORIES ARE SUCCESSFULLY ADDED!", repositories: repositories});
        }
    } catch(e) {
        console.error("ERROR: " + e.message);
        res.status(500).send({message: e.message});
    }
}

// this function will return or compute all the contributors of an specific repository...
exports.fetchAndStoreNewContributors = async (req, res) => {
    try {
        // getting all the repositories from the database...
        Repository.find({}).exec((err, repos) => {
            if(err) {
                res.status(500).send({message: err.message});
            } else {
                let contributors, commits;
                let count = 0;

                // now first, we'll get all the contributors and commits of each
                // repository... then we'll compare the contributors' login and 
                // committer's login and store the dates the author made the commit(s)...
                // then we'll check if an specific author/committer commits only once,
                // then he/she is the new contributor of the repository and in the end
                // we'll store the contributors' data in the desired format in the database...
                repos.forEach(async(repo) => {
                    // getting all the contributors of the repository...
                    let response = await fetch(repo.contributors_url + "?anon=true&page=1&per_page=100", {
                        method: "GET",
                        headers: {
                            'User-Agent': constants.userAgent,
                            // 'Content-Type': 'application/vnd.github+json',
                            'Authorization': process.env.GITHUB_ACCESS_TOKEN
                        },
                    });

                    // handling the rate limit errors...
                    if(response.message.includes(constants.rateLimitExceeded)) {
                        res.status(404).send({message: constants.rateLimitExceededMessage});
                    } else {
                        let links = response.headers.raw().link;
                        contributors = await response.text();
                        let paginationLinks = parseHeaderLink(links[0]);
                        let nextLink = paginationLinks?.next?.url;
                        let data;
                        
                        while(nextLink) {
                            response = await fetch(nextLink, {  
                                method: "GET",
                                headers: {
                                    'User-Agent': constants.userAgent,
                                    'Content-Type': 'application/vnd.github+json',
                                    'Authorization': process.env.GITHUB_ACCESS_TOKEN
                                },
                            });
                            paginationLinks = parseHeaderLink(response.headers.raw().link[0]);
                            data = await response.json();
                            nextLink = paginationLinks?.next?.url;
                            contributors = contributors.concat(data);
                        }
                        
                        // the date on which the repository was created...
                        // const date = moment(repo.created_at, 'DD/MM/YYYY');
                
                        // getting all the commits of an specific contributor of the 
                        // repository from the date of its creation to today...
                        // console.log(repo.commits_url.split("{")[0]);
                        const commitsOfRepo = await fetch(repo.commits_url.split("{")[0] + `?since=${repo.created_at}&until=${Date.now()}&page=1&per_page=100`, {
                            method: "GET",
                            headers: {
                                'User-Agent': constants.userAgent,
                                'Content-Type': 'application/vnd.github+json',
                                'Authorization': process.env.GITHUB_ACCESS_TOKEN
                            },
                        });

                        // handling the rate limit errors...
                        if(response.message.includes(constants.rateLimitExceeded)) {
                            res.status(404).send({message: constants.rateLimitExceededMessage});
                        } else {
                            links = commitsOfRepo.headers.raw().link;
                            paginationLinks = parseHeaderLink(links);
                            nextLink = paginationLinks?.next?.url;
                            commits = await commitsOfRepo.json();
                    
                            while(nextLink) {
                                response = await fetch(nextLink, {  
                                    method: "GET",
                                    headers: {
                                        'User-Agent': constants.userAgent,
                                        'Content-Type': 'application/vnd.github+json',
                                        'Authorization': process.env.GITHUB_ACCESS_TOKEN
                                    },
                                });
                                // console.log(response.headers.raw().link);
                                paginationLinks = parseHeaderLink(response.headers.raw().link[0]);
                                data = await response.json();
                                nextLink = paginationLinks?.next?.url;
                                commits = commits.concat(data);
                            }
                            // console.log(contributors.length, commits.length);
                    
                            let newContributors = [], userCommits = [];
                            let contributorObj = {};

                            // finding the contributors who had made the commits on the
                            // repository based on all the contributors and commits that
                            // we've fetched from the GitHub API...
                            contributors.forEach(contributor => {
                                commits.forEach(commit => {
                                    // console.log(contributor.login, commit.committer.login);
                                    if(contributor.login == commit.committer.login) {
                                        userCommits.push(commit.commit.author.date);
                                    }
                                });
                                contributorObj[contributor.login] = userCommits;
                                newContributors.push(contributorObj);
                                contributorObj = {};
                                userCommits = [];
                            });
                            
                            // computing the number of new contributors...
                            // the contributors' array is an array of objects, where
                            // each object has author name as key and array of date
                            // on which the author made commits as value... if that 
                            // array contains only a single element/commit, then that
                            // author is the new contributor of the repository...
                            newContributors.forEach(contributor => {
                                for(let author of contributor) {
                                    if(contributor[author].length == 1) {
                                        count++;
                                    }
                                }
                            });
                            
                            // storing the new contributors' details in the database...
                            Contributor.create({
                                org: repo.owner.login,
                                reponame: repo.name,
                                year: moment(repo.created_at).format('YYYY'),
                                numOfContributors: count
                            }, (err, contributor) => {
                                if(err) {
                                    res.status(500).send({message: err.message});
                                } else {
                                    count = 0;
                                }
                            });
                        }                
                    }

                });
                
                res.status(200).send({message: "DATA IS SUCCESSFULLY FETCHED AND STORED IN THE REQUIRED FORMAT!"});
            }
        });
    } catch(e) {
        console.error("ERROR: " + e.message);
        res.status(500).send({message: e.message});
    }
}

// this function will return all the contributors based on the username and 
// reponame... the required data is already fetched from the GitHub API and 
// stored in the desired format in the database... here we're just retreiving the
// data from the database... 
exports.getNewContributors = (req, res) => {
    try {
        const username = req.params.username;
        const reponame = req.params.reponame;

        Contributor.find({org: username, reponame: reponame}).exec((err, contributors) => {
            if(err) {
                res.status(500).send({message: err.message});
            } else {
                res.status(200).send(contributors);
            }
        });
    } catch(e) {
        console.error("ERROR: " + e.message);
        res.status(500).send({message: e.message});
    }
}


// gets the users' details...
exports.getUserDetails = (req, res) => {
    const username = req.params.username;
    const options = generateOptions('/users/' + username);

    let userData = "";
    https.get(options, (response) => {
        response.on('data', (chunk) => {
            userData += chunk;
        }).on('end', () => {
            res.status(200).send({user: JSON.parse(userData)});
        }).on('error', (e) => {
            res.status(500).send({message: e.message});
        });
    });
}

// gets no. of commits on a particular repo of a user...
exports.getCommits = (req, res) => {
    const username = req.params.username;
    const repository = req.params.reponame;
    const options = generateOptions('/repos/' + username + '/' + repository + '/commits')

    let commitData = "";
    https.get(options, (response) => {
        response.on('data', (chunk) => {
            commitData += chunk;
        }).on('end', () => {
            res.status(200).send({user: JSON.parse(commitData)});
        }).on('error', (e) => {
            res.status(500).send({message: e.message});
        });
    });
}