

# Project setup steps:

1] Clone the repository


2] Project requirements:

```

NodeJS, NPM, GIT, mysql-community

```

3] Install all project dependencies:

```

npm install

```

4] Add .env file. Replace '*******' with credentials.

Sample-

```

   //JWT secret
   tokenSecret="*************"

   //Razorpay credentials
   Key_id="*************"
   Key_Secret="*************"

   //mail client credentials   
   email_api_key="*************"


   //AWS S3 credentials

   BUCKET_NAME="*************"  
   IAM_USER_KEY="*************"
   IAM_USER_SECRET="*************"
  

   serverUrl = "*************"
   
   //DB credentials if intend to use SQL Implementation
   DB_HOST = "*************"
   DB_NAME = "*************"
   DB_USER = "*************"
   DB_PSD = "*************"
   
   PORT="3002"

```

5] Start the server

```

npm start

```

Note: Ensure sql database is already setup

Tech stack used : JavaScript, HTML, CSS <br/>
Frameworks used : Express, Bootstrap <br/>
Deployment : AWS ec-2 <br/>
CI-CD : Jenkins <br/>
Storage : MySQL(deployment AWS RDS), AWS S3 bucket <br/>

ORM library: Sequelize<br/>
Token based authentication : JWT <br/>

## App features : <br/>
* Integrated payment module : Razorpay API <br/>
* Dynamic pagination <br/>
* Report generation <br/>
* Leaderboard and expense categorization <br/>
