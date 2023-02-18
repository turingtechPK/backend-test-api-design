
# Github Repo New Contributors


### Description

This is an API which can fetch the number of new contributors according to particular owner and repo. You need to provide Year and Month as additional parameters to fetch results in that particular period of time. It uses GitHub Octokit API to fetch the results.


## Set up Project Requirements

You need following requirement to setup your project:

### Prerequisites

- Node (https://node.org/)
- Github (https://github.com/)

### Install Project

Here are the steps to be taken after that:


1. Clone the repository:

git clone https://github.com/AniqJaved/backend-test-api-design.git


2. Change directory:
    ```bash
    cd backend-test-api-design
    ```
3. Install dependencies
    ```bash
    npm install
    ```

4. Create a .env file
5. In the .env file add
    ```bash
    MONGO_URL =  Add mongodb url
    AUTH_TOKEN = Add github authentication token
    ```
6. Start the server
    ```bash
    npm start
    ```

### Usage

#### GET SINGLE REPO NEW CONTRIBUTORS

By using GET Request:

1. In order to get a single repo new contributors by year use owner of repo (in this case airbnb) and name of repo (in this case javascript). Also add year (in this case 2022)
    ```bash
    localhost:8800/api/newContributors/airbnb/javascript/2022
    ```

2. In order to get a single repo new contributors use owner of repo (in this case airbnb) and name of repo (in this case javascript). Also add year (in this case 2022) and month (in this case 08)
    ```bash
    localhost:8800/api/newContributors/airbnb/javascript/2022/08
    ```


#### POST NEW CONTRIBUTORS
 By using POST Request:

 1. In order to post a single repo new contributors by year use owner of repo (in this case airbnb) and name of repo (in this case javascript). Also add year (in this case 2022)
    ```bash
    localhost:8800/api/newContributors/airbnb/javascript/2022
    ```

2. In order to post a single repo new contributors use owner of repo (in this case airbnb) and name of repo (in this case javascript). Also add year (in this case 2022) and month (in this case 08)
    ```bash
    localhost:8800/api/newContributors/airbnb/javascript/2022/08
    ```

#### GET ALL REPO NEW CONTRIBUTORS
By using GET Request:

 1. In order to get all the repos stored use:
    ```bash
    localhost:8800/api/newContributors/all
    ```


## Code Of Conduct 📜

To maintain a safe and inclusive space for everyone to learn and grow, contributors are advised to follow the [Code of Conduct](https://github.com/AniqJaved/employee_evaluation/blob/master/CODE_OF_CONDUCT.md).


## Contribution is fun! ✌🏼

If you have any feedback or suggestions please reach out to me.  

In order to make a hassle-free environment, I implore you all (while contributing) to follow the instructions [Contributing Guidelines](https://github.com/AniqJaved/employee_evaluation/blob/master/CONTRIBUTING.md)!

You can create a <a href="https://github.com/AniqJaved/employee_evaluation/issues">issue</a> and mention there , which new features or extension can make this Project more good.


<!-- ------------------------------------------------------------------------------------------------------------------------------------------------------------------ -->

<br>
  
<br>


<div align="center">

### Show some ❤️ by starring⭐ this awesome Repository!

</div>
<br>  

<h1 align=center> OUR VALUABLE CONTRIBUTORS✨ </h1>
<p align="center">
  
	
<a href="https://github.com/AniqJaved/backend-test-api-design/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=AniqJaved/backend-test-api-design" />
</a>


