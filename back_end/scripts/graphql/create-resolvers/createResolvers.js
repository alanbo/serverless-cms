const fs = require('fs');
const path = require('path');

const getTemplate = require('./getTemplate');
const getListTemplate = require('./getListTemplate');
const putTemplate = require('./putTemplate');
const nestedListTemplate = require('./nestedListTemplate');
const nestedFieldTemplate = require('./nestedFieldTemplate');
const getResolverConfig = require('./getResolverConfig');
const createFunctionResolverDataSource = require('./createFunctionResolverDataSource');
const resolveWithFunction = require('./resolveWithFunction');
const createDatasourceRole = require('./createDatasourceRole');


module.exports = serverless => {
  const sdlString = fs.readFileSync(path.resolve(__dirname, '../../../resources/graphql-api/schema.graphql')).toString('utf8');
  const TYPES = getResolverConfig(sdlString);
  const Resources = {};

  TYPES.forEach(({ type, nested_list_fields = [], nested_fields = [], is_fragment }) => {
    if (is_fragment) {
      Resources[`get${type}`] = getTemplate(type);
      Resources[`get${type}List`] = getListTemplate(type, serverless.service.service);
      Resources[`put${type}`] = putTemplate(type);
    }

    nested_list_fields.forEach(field => {
      Resources[`resolver${type}${field}`] = nestedListTemplate(type, field);
    });

    nested_fields.forEach(field => {
      Resources[`resolver${type}${field}`] = nestedFieldTemplate(type, field);
    });
  });


  // Automatically adds resolvers and datasources for all mutation/query functions.
  const queries = (fs.readdirSync(path.resolve(__dirname, '../../../functions/queries')) || [])
    // only ts files
    .filter(filename => filename.endsWith('.ts'))
    // remove ts extension
    .map(filename => filename.slice(0, filename.length - 3))

  // adds resolver and datasource for each filename
  queries.forEach(name => {
    Resources[`graphQL${name}Resolver`] = resolveWithFunction(name);
    Resources[`graphQL${name}DataSource`] = createFunctionResolverDataSource(name);
  });

  const mutations = (fs.readdirSync(path.resolve(__dirname, '../../../functions/mutations')) || [])
    // only ts files
    .filter(filename => filename.endsWith('.ts'))
    // remove ts extension
    .map(filename => filename.slice(0, filename.length - 3));

  // adds resolver and datasource for each filename
  mutations.forEach(name => {
    Resources[`graphQL${name}Resolver`] = resolveWithFunction(name, true);
    Resources[`graphQL${name}DataSource`] = createFunctionResolverDataSource(name);
  });

  Resources['graphQLFunctionDatasourceRole'] = createDatasourceRole(
    serverless.service.service,
    [...mutations, ...queries]
  );

  return {
    Resources
  };
};