const fs = require('fs');
const path = require('path');

const getTemplate = require('./getTemplate');
const getListTemplate = require('./getListTemplate');
const putTemplate = require('./putTemplate');
const nestedListTemplate = require('./nestedListTemplate');
const nestedFieldTemplate = require('./nestedFieldTemplate');
const getResolverConfig = require('./getResolverConfig');


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

  return {
    Resources
  };
};