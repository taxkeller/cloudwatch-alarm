# cloudwatch-alarm

This is the lambda function which forwards cloudwatch alarm to slack.

## Prerequisites

- yarn
- awscli

## Set up

### Install

- serverless framework
```
$ yarn global add serverless
```

- required packages
```
$ yarn
```

### Create Encrypt Key

```
$ export region=( your region )
$ aws --region $region kms create-key | grep KeyId | cut -d\" -f 4 > .encrypt-key.$region
```

### Generate encrypted keys

```
// copy template
$ cp .secret.json.example .secret.json

// input secret information
$ vim .secret.json

// generate encrypted yml
$ sls encrypt -n secretInfo -v "`cat .secret.json`" -k "`cat .encrypt-key.$region`"
```

## Running on local

```
$ sls offline
```

## Deploy

```
$ sls deploy
```
