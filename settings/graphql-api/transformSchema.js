const fs = require('fs');
const path = require('path');

const { mergeSchemas } = require('graphql-tools');

const sdlString = fs.readFileSync(path.resolve(__dirname, './schema.graphql')).toString('utf8');

const {
  buildSchema,
  printSchema,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLSchema,
  GraphQLID
} = require("graphql");


const graphqlSchemaObj = buildSchema(sdlString);
const type_map = graphqlSchemaObj.getTypeMap();
const type_map_keys = Object.keys(type_map);

const all_types = type_map_keys.map(key => {
  return type_map[key];
});

const fragments = graphqlSchemaObj.getPossibleTypes(graphqlSchemaObj.getType('Fragment'));

function createFragmentInput(fragment) {

}

const query_fields = {};

fragments.forEach(fragment => {
  query_fields[`get${fragment.name}List`] = {
    type: new GraphQLNonNull(new GraphQLList(fragment))
  }
  query_fields[`get${fragment.name}`] = {
    type: fragment,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID)
      }
    }
  }
});

const new_input = new GraphQLInputObjectType({
  name: 'SampleInput',
  fields: {
    sample: {
      type: GraphQLBoolean
    }
  }
});

console.log(new_input);

const new_schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: query_fields
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
      sample: {
        type: GraphQLBoolean,
        args: {
          input: {
            type: new_input
          }
        }
      }
    }
  })
});

const schema = mergeSchemas({
  schemas: [
    graphqlSchemaObj,
    new_schema
  ],
});

console.log(printSchema(schema));