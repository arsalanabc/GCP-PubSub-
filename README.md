This is a sample project to run GCP PubSub service locally on
a testing emulator

Dependencies
- npm
- gcloud
- jre 8+

Install npm
Install gcloud globaly follow "https://cloud.google.com/sdk/docs#deb"


Before run:
`npm i`

## Run the emulator locally
install gcp pubsub emulator    
    `gcloud components install pubsub-emulator`
    `gcloud components update`

start the emulator
`gcloud beta emulators pubsub start --project="test-project"`

Set up env variables
`$(gcloud beta emulators pubsub env-init)` 
OR do it manually
`export PUBSUB_EMULATOR_HOST=localhost:8085`
`export PUBSUB_PROJECT_ID=test-project`

### Run the project
`npm start` this must be run in the same terminal as the env variables command.

## Running the emulator in a docker
`docker-compose up pubsub`


## Running the tests
`npm run docker-test` will setup the cluster, run the tests and destory everything. Any major changes with require `docker-compose build`



