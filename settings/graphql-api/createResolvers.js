const fs = require('fs');
const path = require('path');

const getTemplate = require('./create-resolvers/getTemplate');
const getListTemplate = require('./create-resolvers/getListTemplate');
const putTemplate = require('./create-resolvers/putTemplate');
const nestedListTemplate = require('./create-resolvers/nestedListTemplate');
const nestedFieldTemplate = require('./create-resolvers/nestedFieldTemplate');
const getResolverConfig = require('./getResolverConfig');


module.exports = serverless => {
  const sdlString = fs.readFileSync(path.resolve(__dirname, './schema.graphql')).toString('utf8');
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

  return {
    Resources
  };
};