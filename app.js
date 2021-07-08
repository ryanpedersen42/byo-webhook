const { Webhooks, createNodeMiddleware } = require("@octokit/webhooks");
var EventSource = require("eventsource");
const request = require('request');

// main tool here: https://github.com/octokit/webhooks.js/

const webhooks = new Webhooks({
  secret: "your-github-secret", // https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks
});

// necessary vars
const smeeURL = "your-smee-url" // https://smee.io/
const circleToken = "your-circle-token" // https://app.circleci.com/settings/user/tokens
const apiURL = "your-pipeline-api" // https://circleci.com/docs/api/v2/#operation/triggerPipeline

const webhookProxyUrl = smeeURL; 
const source = new EventSource(webhookProxyUrl);

source.onmessage = (event) => {
  const webhookEvent = JSON.parse(event.data);
  webhooks
    .verifyAndReceive({
      id: webhookEvent["x-request-id"],
      name: webhookEvent["x-github-event"],
      signature: webhookEvent["x-hub-signature"],
      payload: webhookEvent.body,
    })
    .catch(console.error);
};

webhooks.onAny(({ id, name, payload }) => {
  // run logic on events https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads
  if (payload.action !== "reopened" && payload.action !== "opened") {
    return
  }
  
  // kick off pipeline 
  const options = {
    method: 'POST',
    url: apiURL,
    headers: {
      'content-type': 'application/json',
      'Circle-Token': circleToken
    },
    body: {
      branch: payload.pull_request.head.ref,
      parameters: {
        pr_webhook: true,
        pr_user: payload.sender.login,
        pr_number: payload.number,
        pr_action: payload.action,
        pr_sha: payload.pull_request.merge_commit_sha,
        pr_base: payload.pull_request.base.ref,
        pr_commit_message: payload.repository.description
      }
    },
    json: true
  };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    console.log(body);
  });
});

require("http").createServer(createNodeMiddleware(webhooks)).listen(3000);