const app = require("../app");
const { supertest } = require("../utils/packages");
const request = supertest(app);
require("dotenv").config();

// Setting up the database...
const { setupDB } = require("../utils/testing-setup");
setupDB(process.env.URL);

describe("GITHUB API ROUTES' TESTING", () => {
    
    describe("GET USER DETAILS", () => {
      test("shouldn't return user details... API rate limit exceeded!", async () => {
        await request
          .get("/user/:username")
          .send()
          .expect(404);
      });
    });

    describe("GET ALL COMMITS", () => {
      test("shouldn't return all the commits... API rate limit exceeded!", async () => {
        await request
          .get("/commit/:username/:reponame")
          .send()
          .expect(404);
      });
    });
});