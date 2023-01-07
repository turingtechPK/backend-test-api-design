# TuringTech Technical Test / Backend API (Beginner -> Intermediate)

This problem can be divided into five steps

1. Start the server and successfully fetch data from any github api
2. Find/Identify the API/s that cater the requirements
3. Save the data into mongoDB
4. process the data to get the required result 
5. cater all the cases required other than sending the data (error handling etc)

1... for step 1 currently using AXIOS to fetch the api data, apis are working fine but no significant way to do this without using nested loops...
1... AXIOS DOES NOT FACILITATE MORE THAN 50 Requests per hour... first focus is getting the task done... to reduce the complexity and cost of making the api call of commits, will use mongoDb to store some data for future reference.

2.3.4.. using 2 apis to get the data.. saving the data in mongoDb to prevent redundant resource utilization for looping the commits.

5... api limit exausted.... however, now that axios seems to be functioning fine, but 50 calls per hour is not sufficient ,,,,,,  switchingg back to https.....
sub steps needed for task 5:
1: get all contributors -- loop through all pages of contributors 
2: get data from db
3: check of contributors are same as that in DB
3.1: if same ... calculate count and send response
3.2: if not same move to step 4
4: call commits api with start data fetched from Db -- loop through all pages of contributors 
5. loop through commits to find first commit of user








