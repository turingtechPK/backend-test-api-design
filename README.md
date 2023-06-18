# TuringTech Technical Test / Backend API (Beginner -> Intermediate)
Hammad Ahmad Khan's attempt at TuringTech Technical Backend API test. Loom video link will be shared with HR before the deadline.

## Instructions

Test this application by installing nodejs and nestjs.
Install the dependencies of this application using:
    npm install

Follow .env.example to create your .env file

Start the server with the following command:
npm run start:dev

Test api with the following url:
http://localhost:8000/github/${org}/${repo}/${year}/${month}

Month is optional

e.g:
//GET /vercel-labs/ai/2023
{
    "org": "vercel-labs",
    "repository": "ai", 
    "year": "2023",
    "newContributors": 27,
}
