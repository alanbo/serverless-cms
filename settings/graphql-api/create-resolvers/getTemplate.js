const getTemplate = type => ({
  Type: "AWS::AppSync::Resolver",
  Properties: {
    TypeName: "Query",
    DataSourceName: "fragments_database",
    RequestMappingTemplate: `
{
  "version": "2017-02-28",
  "operation": "GetItem",
  "key": {
      "id": $util.dynamodb.toDynamoDBJson($ctx.args.id)
  }
}`,
    ResponseMappingTemplate: "$util.toJson($ctx.result)",
    ApiId: {
      "Fn::GetAtt": ["graphQLApi", "ApiId"]
    },
    FieldName: `get${type}`
  },
  DependsOn: ["graphQLData", "graphQLSchema"]
});

module.exports = getTemplate;