# TuringTech Technical Test / Backend API (Beginner -> Intermediate)

In this test, the goal is to implement a **straightforward** application able to fetch
data from the GitHub API and computes the number of new contributors for each of the repositories of an specific user/organization like Airbnb, in a reliable and efficient way...

Steps followed to solve this problem:

Step 01: First, we'll fetch all the repositories of an organization, extract the necessary data (created_at, reponame, org, contributors_url, etc.), and store it in the database.

Step 02: Retreive those repositories, and for each repository, first find all the contributors of that repository.

Step 03: After that, for each repository, find all the commits that have been made to that repository.

Step 04: After fetching the required data, we'll find which contributor made which commit on the repository and store it in the format as following: 
newContributors = [
    {
        james: [date1, date2, date3, ...]
    },
    {
        rehber: [date1]
    }
];

Step 05: After getting the result in step-04, we'll check if **newContributors** array contains such objects in which the array value corresponding the key, contains only the single value, then that will be our **new contributor** of the repository and we'll increase the count.

Step-06: After finding all the new contributors, we'll store that data in the database...

