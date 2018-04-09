import request from 'request';

export const postMessage = (data) => {
  return new Promise(async (resolve, reject) => {
    const option = getOptions(data);
    await request.post(option, (error, response, body) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(body);
    });
  });
};

const getOptions = (data) => {
  const headers = { 'Content-Type': 'application/json' };
  const body = getBody(data);
  return {
    url: process.env.slackUrl,
    headers: headers,
    body: JSON.stringify(body)
  };
};

const getBody = (data) => {
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
