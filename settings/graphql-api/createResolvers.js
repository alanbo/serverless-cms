const getTemplate = require('./create-resolvers/getTemplate');
const getListTemplate = require('./create-resolvers/getListTemplate');
const putTemplate = require('./create-resolvers/putTemplate');

const TYPES = ['Text', 'Gallery', 'Image', 'Menu', 'Page'];

module.exports = () => {
  const Resources = {};

  TYPES.forEach(type => {
    Resources[`get${type}`] = getTemplate(type);
    Resources[`get${type}List`] = getListTemplate(type);
    Resources[`put${type}`] = putTemplate(type);
  });

  return {
    Resources
  };
};