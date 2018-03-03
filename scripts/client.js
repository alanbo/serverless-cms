function handler (data, serverless, options) {
  console.log('Received Stack Output', data.CognitoARN)
}

module.exports = { handler }
