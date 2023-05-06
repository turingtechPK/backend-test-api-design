# Turing Technologies Backend Hiring Test
This is my attempt at Turing Technologies' backend hiring test. The exact requirements for this test can be found in the README.old.md file. You can view a demonstration of my attempt at https://www.loom.com/share/2659203681dc47c7ad2f1dd187b3a842.

## Get started
Clone the repository on your machine.
```
git clone https://github.com/zohaibadnan137/backend-test-api-design.git
```
Open a terminal window, and install the required dependencies.
```
npm install
```
Create a .env file. The server uses the following environment variables:
```
MONGODB_URI=
PORT=
GITHUB_TOKEN=
```
Start the server.
```
node index.js
```

## Access the API
The API can be tested with something like Postman. The endpoint can be accessed with or without the ```month``` query parameter:
```
http://localhost:PORT/org/repo/year
http://localhost:PORT/org/repo/year/month
```
For example:
```
http://localhost:3000/facebook/react/2019
```
Two responses have been defined based on whether the month has been specified:
```
org: <org>
repo: <repo>
year: <year>
newContributors: _

org: <org>
repo: <repo>
year: <year>
month: <month>
newContributors: _
```
In the event of a sucessful response, a ```200``` status code will be sent. If any errors arise, a ```500``` error code will be sent along with a description.
