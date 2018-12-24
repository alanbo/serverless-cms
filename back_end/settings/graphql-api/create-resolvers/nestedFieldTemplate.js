const getTemplate = (TypeName, FieldName) => ({
  Type: "AWS::AppSync::Resolver",
  Properties: {
    TypeName,
    DataSourceName: "fragments_database",
    RequestMappingTemplate: `
{
  "version": "2017-02-28",
  "operation": "GetItem",
  "key": {
      "id": $util.toJson($context.source.${FieldName})
  }
}`,
    ResponseMappingTemplate: "$util.toJson($ctx.result)",
    ApiId: {
      "Fn::GetAtt": ["graphQLApi", "ApiId"]
    },
    FieldName,
  },
  DependsOn: ["graphQLData", "graphQLSchema"]
});

module.exports = getTemplate;