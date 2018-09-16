const path = require('path');
const fs = require('fs');

function handler ({
  region,
  userPoolId,
  userPoolWebClientId,
  identityPoolId,
  ServiceEndpoint,
  GraphQLUrl,
  GraphQLARN,
  GraphQLApiId,
  GraphQLApiKey,
  BucketName
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
  const file_path = path.join(__dirname, '../admin/src', 'cognito.js');
  const file_path_vars = path.join(__dirname, '../admin/src', 'aws-stack-vars.js');
  const file_path_appsync = path.join(__dirname, '../admin/src', 'AppSync.js');

  const app_sync_obj = {
    "graphqlEndpoint": GraphQLUrl,
    "region": region,
    "authenticationType": "AMAZON_COGNITO_USER_POOLS",
    "apiKey": GraphQLApiKey
  }

  const app_sync = `export default ${JSON.stringify(app_sync_obj, null, '  ')}`;

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

    console.log('Sucessfully saved: ', client_vars );
  });

  fs.writeFile(file_path_appsync, app_sync, err => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Sucessfully saved: ', client_vars );
  });
}

module.exports = { handler }
