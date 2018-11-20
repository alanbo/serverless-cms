const getTemplate = require('./create-resolvers/getTemplate');

console.log(getTemplate('Text'));

module.exports = () => {
  return {
    Resources: {
      getFragment: getTemplate('Fragment')
    }
  };
};