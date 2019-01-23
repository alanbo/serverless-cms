const nestedListTemplate = (TypeName, FieldName) => ({
  Type: "AWS::AppSync::Resolver",
  Properties: {
    TypeName,
    DataSourceName: "app_sync_lambda_resolver",
    RequestMappingTemplate: `
{
  "version" : "2017-02-28",
  "operation": "Invoke",
  "payload": $util.toJson($context.source.${FieldName})
}`,
    ResponseMappingTemplate: "$util.toJson($ctx.result)",
    ApiId: {
      "Fn::GetAtt": ["graphQLApi", "ApiId"]
    },
    FieldName
  },
  DependsOn: ["graphQLLambda", "graphQLSchema"]
});

module.exports = nestedListTemplate;