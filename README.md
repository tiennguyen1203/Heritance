<!-- Write some documents -->
## Testing
`docker-compose -f docker-compose.yml run app npm run test`

## Run API server and database locally
`docker-compose up --build`

## API docs:
`http://localhost:3000/api-docs/swagger.json` 

## DB Diagram
`https://dbdiagram.io/d/6209dce085022f4ee5895969`

## Deploy: 
Go to docker docs then do step by step
`https://docs.docker.com/language/nodejs/deploy/`

## Security:
1. docs of docker have the explanation of secure docker image
2. We can use authentication mechanism to ensure that only the owner can get the created forms and collected data

## CI/CD: 
* Setup CI/CD with github action
* CI to run test each time we push/merge code to master/develop branch
* CD to auto rebuild docker image, deploy to cloud
