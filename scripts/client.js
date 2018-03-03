const path = require('path');
const fs = require('fs');

function handler ({ region, userPoolId, userPoolWebClientId }, serverless, options) {
  const client_data = { region, userPoolId, userPoolWebClientId };
  const file_content = `export default ${JSON.stringify(client_data, null, '  ')}`;
  const file_path = path.join(__dirname, '../public/admin', 'cognito.js');

  fs.writeFile(file_path, file_content, err => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Sucessfully saved: ', client_data);
  });
}

module.exports = { handler }
