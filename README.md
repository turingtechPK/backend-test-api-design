# Turing Technologies Backend Test

Made using Node, express, typescript, and mongo db.

Add your github access token, and mongodb uri for db.

Routes available are:

- http://localhost:3000/api/contributors/org/repo/year/month
- http://localhost:3000/api/contributors/org/repo/year

Run using docker compose or locally as dev

- `docker compose up` for docker container
- `npm run dev` for local

### Improvements to be made

Add unit tests
Add logger
Add system wide error handler
Separate our axios client to be used at all services
Use validation library like Joi or Zod
Add retries for db connections etc
