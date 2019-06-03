const createAppSyncRole = (name, func_list) => ({
  Type: "AWS::IAM::Role",
  Properties: {
    RoleName: `${name}--AppSyncRole`,
    AssumeRolePolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: {
            Service: [
              "appsync.amazonaws.com"
            ]
          },
          Action: "sts:AssumeRole"
        }
      ]
    },
    Policies: [
      {
        PolicyName: `${name}--AppSyncPolicy`,
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: [
                "lambda:invokeFunction"
              ],
              Resource: func_list.map(func_name => {
                return {
                  "Fn::GetAtt": [
                    `${func_name.charAt(0).toUpperCase() + func_name.slice(1)}LambdaFunction`,
                    "Arn"
                  ]
                }
              })
            }
          ]
        }
      }
    ]
  }
});

module.exports = createAppSyncRole;