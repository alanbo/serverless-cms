var AWS = require('aws-sdk');
import queryGQL from './render-pages/queryGQL';
import getFromS3 from './render-pages/getFromS3';
import saveToS3 from './render-pages/saveToS3';
import * as R from 'ramda';
import moveTemplatesToTemp from './render-pages/moveTemplatesToTemp';
import * as pug from 'pug';
import path from 'path';
import { Handler } from 'aws-lambda';

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

interface PageType {
  name: string,
  query: string,
  template: string,
  inputs: {
    title: string,
    type: string,
    name: string
  }[],
}

interface GetDataResult {
  page_type_list: PageType[],

  page_list: {
    id: string,
    name: string,
    fragments: string[],
    page_type: string
  }[]
}

export const handler: Handler = async () => {
  await moveTemplatesToTemp()

  const { data: { page_type_list, page_list } } = await queryGQL<GetDataResult>(getData);

  if (!page_type_list || !page_list) {
    return false;
  }

  const query_results = await Promise.all(page_list.map(async page => {
    const type: PageType = R.find(R.propEq('name', page.page_type))(page_type_list);

    const query_buf = await getFromS3(type.query, true);

    if (!query_buf) {
      return Promise.reject(`Can\'t read the query for page ${page.name}`);
    }

    const query = query_buf.toString('utf8');
    const gql_params: { [ix: string]: string } = {};

    type.inputs.forEach((input, i) => {
      gql_params[input.name] = page.fragments[i];
    });

    const { data } = await queryGQL(gql(query), gql_params);
    const html = pug.renderFile(path.resolve('/tmp/templates', type.template), Object.assign({}, data));

    const Key = page.name.replace(/(\W+$)|(^\W+)/g, '').replace(/\W+/g, "_");

    return { Key, Body: html };
  }));

  if (!query_results) {
    return false;
  }

  await Promise.all(query_results.map(({ Key, Body }) => saveToS3(Key, Body))).catch(console.log);

  return true;
}