Instructions to run the program:

Install node js.

Run the following command in your terminal. This will install all required packages listed in package.json file.
"npm install"

To run the application move to the program directory in your terminal and type the following command.
"node app.js"
App will be listening on localhost port 3000.

Now use any api software like postman to hit the following endpoint.
http://localhost:3000/{{username}}/{{repository}}/{{year}}

where
	username: owner of the repository
	repository: repository name
	year: Year till which you want to see the contributions.

Api will save the response in a csv file in storage folder located in program directory. Further response will be appended to the same csv.

Response will be in the following format

{
    "org": "airbnb",
    "repository": "javascript",
    "year": "2022",
    "newContributors": 18
}