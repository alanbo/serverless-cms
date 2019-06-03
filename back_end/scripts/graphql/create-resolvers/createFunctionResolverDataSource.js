const createFunctionResolverDataSource = name => (
  {
    Type: "AWS::AppSync::DataSource",
    Properties: {
      Type: "AWS_LAMBDA",
      Description: `${name} lambda resolver function`,
      ServiceRoleArn: {
        "Fn::GetAtt": [
          "graphQLAppSyncRole",
          "Arn"
        ]
      },
      ApiId: {
        "Fn::GetAtt": [
          "graphQLApi",
          "ApiId"
        ]
      },
      Name: `${name}DataSource`,
      LambdaConfig: {
        LambdaFunctionArn: {
          "Fn::GetAtt": [
            // Capitalized name
            `${name.charAt(0).toUpperCase() + name.slice(1)}LambdaFunction`,
            "Arn"
          ]
        }
      }
    }
  }
);

module.exports = createFunctionResolverDataSource;