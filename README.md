# BYO Webhooks

Tool to help ingest additional triggers / webhooks and kick off pipelines in CircleCI

The app is making use of 
* [Octokit Webhooks](https://github.com/octokit/webhooks.js/)
* [Smee](https://smee.io/) for local testing, but can also set up a server or serverless function. 


## Get URL from Smee

* Get Webhook Proxy URL, which will be used in `app.js` and for GH webhook


## Setting up in GitHub

1. Go to your repo > Settings > Webhooks 
2. Add new webhook
3. For Payload URL, use Webhook Proxy URL from your new channel.
4. Content type application/json
5. Create a new secret (which will need to be added in the app as well)
6. Select the events you'd like to set up webhook triggers for. The app was made for PR events, but you can check for anything you'd like here.


## Necessary Variables

You will need to populate these in `app.js`
* GitHub webhook secret
* Smee Webhook Proxy URL
* [CircleCI API Token](https://app.circleci.com/settings/user/tokens)
* CircleCI pipeline API URL with your org and project name

## Setting up in CircleCI

Example config for your project located at `.circleci/config.yml`

## Using the app

```
npm install
npm start
```