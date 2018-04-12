import request from 'request';
import { decrypt } from './kms-lib';

export const postMessage = (data) => {
  getOptions(data)
    .then(async (option) => {
      await request.post(option, (error, response, body) => {
        if (error) {
          console.log(error);
          throw new Error(error);
        }
        return body;
      });
    })
    .catch((e) => {
      console.log(e);
      throw new Error(e);
    })
  ;
};

const getOptions = async (data) => {
  return new Promise(async(resolve, reject) => {
    await decrypt(process.env.secretInfo)
      .then((secretInfo) => {
        const headers = { 'Content-Type': 'application/json' };
        const body = getBody(data, secretInfo.slack.channel);
        resolve({
          url: secretInfo.slack.webhookUrl,
          headers: headers,
          body: JSON.stringify(body)
        });
      })
      .catch((e) => { reject(); })
    ;
  });
};

const getBody = (data, channel) => {
  return {
    channel: process.env.slackChannel,
    attachments: [
      {
        pretext: "Alert message",
        color: "#36a64f",
        author_name: data.logGroupName,
        title: data.logStreamName,
        text: data.message
      }
    ]
  };
};
