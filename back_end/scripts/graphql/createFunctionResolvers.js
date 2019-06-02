const fs = require('fs');
const path = require('path');

module.exports = serverless => {
  const functions = {};

  // Automatically adds resolvers and datasources for all mutation/query functions.
  const queries = (fs.readdirSync(path.resolve(__dirname, '../../functions/queries')) || [])
    // only ts files
    .filter(filename => filename.endsWith('.ts'))
    // remove ts extension
    .map(filename => filename.slice(0, filename.length - 3))

  // adds resolver and datasource for each filename
  queries.forEach(name => {
    functions[name] = {
      handler: `functions/queries/${name}.handler`,
      role: 'genericFunctionRole',
      // TO DO: those values shouldn't be hardcoded
      // create an option to configure them
      timeout: 10,
      memorySize: 2048,
      environment: {
        BUCKET: "${file(../slscms-config.yml):bucket_name}",
        FRAGMENTS_TABLE: "${self:service}-fragments",
        REGION: "${self:provider.region}",
        GRAPHQL: {
          "Fn::GetAtt": [
            "graphQLApi",
            "GraphQLUrl"
          ]
        }
      }
    };
  });

  const mutations = (fs.readdirSync(path.resolve(__dirname, '../../functions/mutations')) || [])
    // only ts files
    .filter(filename => filename.endsWith('.ts'))
    // remove ts extension
    .map(filename => filename.slice(0, filename.length - 3));

  // adds resolver and datasource for each filename
  mutations.forEach(name => {
    functions[name] = {
      handler: `functions/mutations/${name}.handler`,
      role: 'genericFunctionRole',
      // TO DO: those values shouldn't be hardcoded
      // create an option to configure them
      timeout: 10,
      memorySize: 2048,
      environment: {
        BUCKET: "${file(../slscms-config.yml):bucket_name}",
        FRAGMENTS_TABLE: "${self:service}-fragments",
        REGION: "${self:provider.region}",
        GRAPHQL: {
          "Fn::GetAtt": [
            "graphQLApi",
            "GraphQLUrl"
          ]
        }
      }
    };
  });

  return functions;
};