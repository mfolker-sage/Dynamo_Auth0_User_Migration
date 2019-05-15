# Dynamo_Auth0_User_Migration

Scripts and Lambda function(s) for supporting migration of customers into Auth0 from a Dynamo Database

# Usage / Instructions

##Auth0 functions

These must be copied into the Auth0 connection settings screen.

##Lambda function

To run this locally you will require Lambda Local (https://www.npmjs.com/package/lambda-local)

npm install -g lambda-local

Then create a file for event data. eventdata.js is already in the git ignore file.

touch eventdata.js

Then you can run locally with

lambda-local -l index.js -e eventdata.js

##Deployment

Use the script

###Other useful tooling

https://ranxing.wordpress.com/2016/12/13/add-zip-into-git-bash-on-windows/
