const putTemplate = type => ({
  Type: "AWS::AppSync::Resolver",
  Properties: {
    TypeName: "Mutation",
    DataSourceName: "fragments_database",
    RequestMappingTemplate: `
#set($attrs = $ctx.args.input)
#set($attrs.lastModified = $util.time.nowEpochMilliSeconds().intValue() )
#set($attrs.is_deleted = false )
#set($attrs.type = "${type}")

#set( $id = '' )

#if( $attrs.id )
  #set( $id = $util.dynamodb.toDynamoDBJson($attrs.id) )
#else
  #set( $id = $util.dynamodb.toDynamoDBJson($util.autoId()) )
#end

{
    "version" : "2017-02-28",
    "operation" : "PutItem",
    "key" : {
        "id": $id
    },
    "attributeValues" : $util.dynamodb.toMapValuesJson($attrs)
}`,
    ResponseMappingTemplate: "$util.toJson($ctx.result)",
    ApiId: {
      "Fn::GetAtt": ["graphQLApi", "ApiId"]
    },
    FieldName: `put${type}`
  },
  DependsOn: ["graphQLData", "graphQLSchema"]
});

module.exports = putTemplate;