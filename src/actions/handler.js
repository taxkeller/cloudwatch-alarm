import { success, failure } from '../libs/response-lib';
import { postMessage } from '../libs/slack-lib';
import { fetchMetric } from '../libs/cloudwatchlogs-lib';

export const main = (event, context, callback) => {
  return new Promise((resolve, reject) => { resolve(event); })
    .then(getRequest)
    .then(fetchMetric)
    .then(postMessage)
    .then((body) => { success(body, callback); })
    .catch((e) => { 
      postMessage({
        logGroupName: 'Error',
        logStreamName: 'Alert-error',
        message: (typeof e === 'object') ? e.message : e
      });
      failure(e, callback);
    })
  ;
};

const getRequest = (data) => {
  return new Promise((resolve, reject) => { resolve(data); })
    .then(hasRecords)
    .then(hasSns)
    .then(hasTimestamp)
    .then(hasMessage)
    .then(hasTrigger)
    .then(hasMetricName)
    .then(hasNamespace)
    .then((trigger) => {
      const timestamp = data.Records[0].Sns.Timestamp;

      return {
        metricName: trigger.MetricName,
        metricNamespace: trigger.Namespace,
        timestamp: Date.parse(timestamp) - 300000
      };
    })
    .catch((e) => { throw new Error(e); })
  ;
};

const hasRecords = (data) => {
  return new Promise((resolve, reject) => {
    if (!('Records' in data)) {
      reject(`No records`);
    }
    resolve(data.Records[0]);
  });
};

const hasSns = (record) => {
  return new Promise((resolve, reject) => {
    if (!('Sns' in record)) {
      reject(`No Sns`);
    }
    resolve(record.Sns);
  });
};

const hasTimestamp = (sns) => {
  return new Promise((resolve, reject) => {
    if (!('Timestamp' in sns)) {
      reject(`No Timestamp`);
    }
    resolve(sns);
  });
};

const hasMessage = (sns) => {
  return new Promise((resolve, reject) => {
    if (!('Message' in sns)) {
      reject(`No Message`);
    }
    resolve(JSON.parse(sns.Message));
  });
};

const hasTrigger = (message) => {
  return new Promise((resolve, reject) => {
    if (!('Trigger' in message)) {
      reject('No Trigger');
    }
    resolve(message.Trigger);
  });
};

const hasMetricName = (trigger) => {
  return new Promise((resolve, reject) => {
    if (!('MetricName' in trigger)) {
      reject(`No MetricName`);
    }
    resolve(trigger);
  });
};

const hasNamespace = (trigger) => {
  return new Promise((resolve, reject) => {
    if (!('Namespace' in trigger)) {
      reject(`No Namespace`);
    }
    resolve(trigger);
  });
};
