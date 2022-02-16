<!-- Write some documents -->
#To run test
docker-compose -f docker-compose.yml run app npm run test

#To run the server and database locally:
docker-compose up --build

#To see the API docs:
http://localhost:3000/api-docs/swagger.json

#Deploy: 
Go to docker docs then do step by step
https://docs.docker.com/language/nodejs/deploy/

#Security:
1. docs of docker have the explanation of secure docker image
2. We can use jwt/api-key mechanism to ensure that only the owner can get createdForm and collected data

#CI/CD: Setup CI/CD with github action
1. CI to run test each time we push/merge code to master/develop branch
2. CD to auto rebuild docker image, deploy to cloud
