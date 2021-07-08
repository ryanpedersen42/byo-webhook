# BYO Webhooks

Tool to help ingest additional triggers / webhooks and kick off pipelines in CircleCI

The app is making use of [Octokit Webhooks](https://github.com/octokit/webhooks.js/)

# Necessary Variables

Populate these in `app.js`
* GitHub webhook Secret
* Smee URL
* CircleCI API Token
* CircleCI URL with your org and project name

# Using the app

Set up to be run locally with Smee, but can also be updated to be hosted somewhere or set up severless function.