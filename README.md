## Backend-test-api-designs
Introduction
The Backend-test-api-designs is a Node.js with Express framework application designed to fetch and track the number of new monthly contributors for each repository within a specified GitHub organization. Utilizing the GitHub API, this application retrieves contributor data, which is then stored and managed in a MongoDB database. Additionally, it provides a RESTful API interface for accessing this data, offering an insightful view into repository contributor trends over time.

## Setup Instructions
Prerequisites
Node.js 
npm 
MongoDB 
A GitHub Personal Access Token
Cloning the Repository
To start using this application, clone the repository to your local machine:

bash
Copy code
git clone https://github.com/Alishbaiftikhar/backend-test-api-design.git
-cd backend-test-api-design
-Installing Dependencies
-Install the required Node.js packages:

-bash
Copy code
npm install



How to Run
-Starting the Server
To start the application, run:

-bash
Copy code
npm start
This will start the server on http://localhost:5000. Adjust the port in your environment variables if necessary.

## Testing
Running Tests
Execute the following command to run the automated test suite:

-bash
Copy code
npm test
Ensure all tests pass successfully to verify the application is functioning correctly
