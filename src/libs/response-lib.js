export const success = (body, callback) => {
  body = JSON.stringify(body);
  buildResponse(200, body, callback);
};

export const failure = (error, callback) => {
  const message = (typeof error === 'object') ? error.message : error;
  const body = JSON.stringify({ message: message });
  buildResponse(500, body, callback);
};

const buildResponse = (statusCode, body, callback) => {
  const response = {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: body
  };

  callback(null, response);
};
