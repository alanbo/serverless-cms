const resolveWithFunction = (name, is_mutation) => (
  {
    Type: 'AWS::AppSync::Resolver',
    Properties: {
      TypeName: is_mutation ? 'Mutation' : 'Query',
      DataSourceName: `${name}DataSource`,
      RequestMappingTemplate: `
{
  "version" : "2017-02-28",
  "operation": "Invoke",
  "payload": $util.toJson($context.arguments)
}
`,
      ResponseMappingTemplate: '$util.toJson($ctx.result)',
      ApiId: {
        'Fn::GetAtt': [
          'graphQLApi',
          'ApiId'
        ]
      },
      FieldName: name
    },
    DependsOn: [
      `graphQL${name}DataSource`,
      'graphQLSchema'
    ]
  }
);

module.exports = resolveWithFunction;

