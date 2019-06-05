import AWS from 'aws-sdk';
import { Handler } from 'aws-lambda';
const s3 = new AWS.S3();

export const handler: Handler = async () => {
  const params = {
    Bucket: process.env.BUCKET,
    Key: 'templates/pages.json',
  };

  const data = await s3.getObject(params).promise();
  const pages_data = JSON.parse(data.Body.toString('utf8'));
  const page_types = Object.keys(pages_data);

  return page_types.map(name => ({
    name,
    template: pages_data[name].template,
    query: pages_data[name].query,
    inputs: pages_data[name].inputs
  }))
}