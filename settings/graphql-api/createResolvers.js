const getTemplate = require('./create-resolvers/getTemplate');
const getListTemplate = require('./create-resolvers/getListTemplate');
const putTemplate = require('./create-resolvers/putTemplate');
const nestedListTemplate = require('./create-resolvers/nestedListTemplate');

const TYPES = [
  {
    type: 'Text'
  },
  {
    type: 'Gallery',
    nested_list_fields: ['images']
  },
  {
    type: 'Image'
  },
  {
    type: 'Menu'
  },
  {
    type: 'Page'
  }
];

module.exports = serverless => {
  console.log(serverless.service.service);
  const Resources = {};

  TYPES.forEach(({ type, nested_list_fields, nested_fields }) => {
    Resources[`get${type}`] = getTemplate(type);
    Resources[`get${type}List`] = getListTemplate(type, serverless.service.service);
    Resources[`put${type}`] = putTemplate(type);

    if (Array.isArray(nested_list_fields)) {
      nested_list_fields.forEach(field => {
        Resources[`resolver${type}${field}`] = nestedListTemplate(type, field);
      });
    }

    if (nested_fields) {
      nested_fields.forEach(field => {
        Resources[`resolver${type}${field}`] = nestedFieldTemplate(type, field);
      });
    }
  });

  return {
    Resources
  };
};