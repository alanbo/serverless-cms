const path = require('path');
const fs = require('fs');

function handler({
  region,
  userPoolId,
  userPoolWebClientId,
  identityPoolId,
  ServiceEndpoint,
  GraphQLUrl,
  GraphQLARN,
  GraphQLApiId,
  BucketName,
  WebsiteURLStaging,
  WebsiteURLProduction,
}, serverless, options) {

  const client_data = { region, userPoolId, userPoolWebClientId, identityPoolId };
  const client_vars = {
    endpoint: ServiceEndpoint,
    graphqlApiId: GraphQLApiId,
    bucket: BucketName,
    graphql_endpoint: GraphQLUrl,
    region
  };

  const file_content = `export default ${JSON.stringify(client_data, null, '  ')}`;
  const file_vars = `export default ${JSON.stringify(client_vars, null, '  ')}`;
  const file_path = path.join(__dirname, '../../admin/src', 'cognito.js');
  const file_path_vars = path.join(__dirname, '../../admin/src', 'aws-stack-vars.js');
  const file_path_appsync = path.join(__dirname, '../../admin/src', 'AppSync.js');
  const file_path_root_wurl = path.join(__dirname, '../../', 'website-url.txt');


  const app_sync_obj = {
    "graphqlEndpoint": GraphQLUrl,
    "region": region,
    "authenticationType": "AMAZON_COGNITO_USER_POOLS"
  }

  const app_sync = `export default ${JSON.stringify(app_sync_obj, null, '  ')}`;

  const website_urls = `
The website staging url is: ${WebsiteURLStaging}
The website production url is: ${WebsiteURLProduction}
The website url will only be activated when you render index page in the admin dashboard. 
The admin dashboard url is: ${WebsiteURLStaging}/admin
  `;

  fs.writeFile(file_path, file_content, err => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Sucessfully saved: ', client_data);
  });

  fs.writeFile(file_path_vars, file_vars, err => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Sucessfully saved: ', client_vars);
  });

  fs.writeFile(file_path_appsync, app_sync, err => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Sucessfully saved: ', client_vars);
  });

  fs.writeFile(file_path_root_wurl, website_urls, err => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(website_urls);
  });


}

module.exports = { handler }
