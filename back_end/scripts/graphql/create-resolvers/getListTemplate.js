const getListTemplate = (type, sls_name) => ({
  Type: "AWS::AppSync::Resolver",
  Properties: {
    TypeName: "Query",
    DataSourceName: "fragments_database",
    RequestMappingTemplate: `
{
  "version" : "2017-02-28",
  "operation" : "Query",
  "index" : "${sls_name}-fragments-type-name",
  "query" : {
      "expression": "#type = :type",
      "expressionNames" : {
        "#type": "type"
      },
      "expressionValues": {
        ":type": {
            "S": "${type}"
          }
      }
  }
}`,
    ResponseMappingTemplate: "$util.toJson($ctx.result.items)",
    ApiId: {
      "Fn::GetAtt": ["graphQLApi", "ApiId"]
    },
    FieldName: `get${type}List`
  },
  DependsOn: ["graphQLData", "graphQLSchema"]
});

module.exports = getListTemplate;