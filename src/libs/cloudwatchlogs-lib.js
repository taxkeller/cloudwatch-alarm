import AWS from 'aws-sdk';

export const fetchMetric = (data) => {
  return new Promise(async (resolve, reject) => {
    const params = {
      metricName: data.metricName,
      metricNamespace: data.metricNamespace
    };

    const cloudwatchlogs = new AWS.CloudWatchLogs({ region: process.env.region });
    await cloudwatchlogs.describeMetricFilters(params, async (err, metric) => {
      if (isFailedDescribeMetricFilters(err, metric)) {
        reject(`Failed to describe metric filters`);
        return;
      }

      const eventParams = {
        logGroupName: metric.metricFilters[0].logGroupName,
        filterPattern: metric.metricFilters[0].filterPattern,
        startTime: data.timestamp
      };

      await cloudwatchlogs.filterLogEvents(eventParams, (err, event) => {
        if (isFailedFilterLogEvents(err, event)) {
          reject(`Failed to filter log events`);
          return;
        }
        const result = {
          logGroupName: metric.metricFilters[0].logGroupName,
          logStreamName: event.events[0].logStreamName,
          message: event.events[0].message
        };
        resolve(result);
      });
    });
  });
};

const isFailedDescribeMetricFilters = (err, metric) => {
  if (err) {
    console.log(err);
    return true;
  }
  if (!('metricFilters' in metric)) {
    console.log('No metricFilters');
    return true;
  }
  if (!metric.metricFilters[0]) {
    console.log('No elements in metricFilters');
    return true;
  }

  const metricFilter = metric.metricFilters[0];
  if (!('logGroupName' in metricFilter)) {
    console.log('No logGroupName');
    return true;
  }
  if (!('filterPattern' in metricFilter)) {
    console.log('No filterPattern');
    return true;
  }

  return false;
};

const isFailedFilterLogEvents = (err, data) => {
  if (err) {
    console.log(err);
    return true;
  }
  if (!('events' in data)) {
    console.log('No events');
    return true;
  }
  if (!data.events[0]) {
    console.log('No elements in events');
    return true;
  }

  const event = data.events[0];
  if (!('logStreamName' in event)) {
    console.log('No logStreamName');
    return true;
  }
  if (!('message' in event)) {
    console.log('No message');
    return true;
  }

  return false;
};
