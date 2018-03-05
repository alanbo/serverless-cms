const path = require('path');
const fs = require('fs');

function handler ({ region, userPoolId, userPoolWebClientId, ServiceEndpoint }, serverless, options) {
  const client_data = { region, userPoolId, userPoolWebClientId };
  const client_vars = { endpoint: ServiceEndpoint };
  const file_content = `export default ${JSON.stringify(client_data, null, '  ')}`;
  const file_vars = `export default ${JSON.stringify(client_vars, null, '  ')}`;
  const file_path = path.join(__dirname, '../public/admin/src', 'cognito.js');
  const file_path_vars = path.join(__dirname, '../public/admin/src', 'aws-stack-vars.js');

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
}

module.exports = { handler }
