# TTL-Terminator

TTL Terminator (AWS Lambda Function) is called periodically and deletes CFN Stacks without or with expired TTL tag.  

**AGAIN: TTL TERMINATOR DELETES CFN STACKS WITHOUT OR WITH EXPIRED TTL TAG**

[![Build Status](https://travis-ci.org/LAtanassov/ttl-terminator.svg?branch=master)](https://travis-ci.org/LAtanassov/ttl-terminator)

## Run locally

requires
* installed [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* installed [Node.js](https://nodejs.org/en/)

```bash
./invoke.sh # runs TTL-Terminator
./debug.sh  # runs TTL-Terminator in debug mode
```

for debug see [step-through debugging lambda functions locally](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-debugging.html)


## Deploy on AWS

```bash
sam build
sam deploy --guided
```

## Unit tests

Tests are defined in the `__tests__` folder in this project. Use `npm` to install the [Jest test framework](https://jestjs.io/) and run unit tests.

```bash
npm install
npm run test
```

## Cleanup

To delete the sample application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
aws cloudformation delete-stack --stack-name ttl-terminator
```
