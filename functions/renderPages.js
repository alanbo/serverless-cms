var AWS = require('aws-sdk');
const s3 = new AWS.S3();
import queryGQL from './render-pages/queryGQL';
import getFromS3 from './render-pages/getFromS3';
import saveToS3 from './render-pages/saveToS3';
import * as R from 'ramda';
import moveTemplatesToTemp from './render-pages/moveTemplatesToTemp';
import * as pug from 'pug';
import path from 'path';

const gql = require('graphql-tag');

const getData = gql`
  {
    page_type_list: getPageTypeList {
      name
      query
      template
      inputs {
        title
        type
        name
      }
    }

    page_list: getPageList {
      id
      name
      fragments
      page_type
    }
  } 
`;

export const handler = async (event, context, callback) => {
  await moveTemplatesToTemp();
  const { data: { page_type_list, page_list } } = await queryGQL(getData);

  const query_results = await Promise.all(page_list.map(async page => {
    const type = R.find(R.propEq('name', page.page_type))(page_type_list);
    const query = (await getFromS3(type.query, true)).toString('utf8');
    const gql_params = {};

    type.inputs.forEach((input, i) => {
      gql_params[input.name] = page.fragments[i];
    });

    const { data } = await queryGQL(gql(query), gql_params);
    const html = pug.renderFile(path.resolve('/tmp/templates', type.template), Object.assign({}, data));

    return { Key: page.name, Body: html };
  }));

  return (await Promise.all(query_results.map(({ Key, Body }) => saveToS3(Key, Body))).catch(console.log));
}