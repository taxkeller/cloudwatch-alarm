import AWS from 'aws-sdk';

export const decrypt = (secretText) => {
  const region = process.env.region;
  AWS.config.update({ region: region });
  const kms = new AWS.KMS({ endpoint: `kms.${region}.amazonaws.com` });

  return kms.decrypt({ CiphertextBlob: Buffer(secretText, 'base64') })
    .promise()
    .then((data) => {
      const decryptedText = String(data.Plaintext);
      return JSON.parse(decryptedText);
    })
    .catch((e) => {
      console.log(e);
      throw new Error(`decrypt error`);
    })
  ;
};
