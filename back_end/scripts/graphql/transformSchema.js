const fs = require('fs');
const path = require('path');
const { mergeSchemas } = require('graphql-tools');
const sdlString = fs.readFileSync(path.resolve(__dirname, '../../resources/graphql-api/schema.graphql')).toString('utf8');

const {
  buildSchema,
  printSchema,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLScalarType
} = require("graphql");


const graphqlSchemaObj = buildSchema(sdlString);
const type_map = graphqlSchemaObj.getTypeMap();
const fragments = graphqlSchemaObj.getPossibleTypes(graphqlSchemaObj.getType('Fragment'));

const inputs_cache = new Map();


// a recursive function that creates inputs based on fields of the type
function createInput(type, is_root) {
  switch (type.constructor) {
    case GraphQLScalarType:
      return type;
    case GraphQLNonNull:
      return (new GraphQLNonNull(createInput(type.ofType)));
    case GraphQLList:
      return (new GraphQLList(createInput(type.ofType)));
    case GraphQLObjectType: {
      // check if it's a fragment
      const is_fragment = !!type.getInterfaces().filter((interface) => interface.name === 'Fragment').length;

      // ift it's a fragment then refer to it by ID
      if (is_fragment && !is_root) {
        return GraphQLID
      }

      // otherwise create a new input
      const name = `${type.name}Input`;

      // if it is in cache
      // it means it's a recursive call of the parent input
      // point to the parent instead of recreating it infinitely
      if (inputs_cache.has(name)) {
        return inputs_cache.get(name);
      }

      const new_input = new GraphQLInputObjectType({
        name,
        fields: setFields
      });

      // caches the input in case it will recursively refer to itself
      inputs_cache.set(name, new_input);

      function setFields() {
        const type_fields = type.getFields();
        const fields = {};

        Object.keys(type_fields).forEach(key => {
          const field = type_fields[key];

          // makes sure that id on the root input is not nullable id type
          if (key === 'id' && is_root) {
            fields[key] = { type: GraphQLID };
            // there is no need for lastModified input, it is added automatically
          } else if (key === 'lastModified' && is_root) {
            return;
          } else {
            fields[key] = { type: createInput(field.type) };
          }
        });

        return fields;
      }

      return new_input;
    }

    default:
      return GraphQLBoolean;
  }
}

module.exports = () => {
  const query_fields = {};
  const mutation_fields = {};

  fragments.forEach(fragment => {
    // add list queries
    query_fields[`get${fragment.name}List`] = {
      type: new GraphQLNonNull(new GraphQLList(fragment))
    }

    // add get item queries
    query_fields[`get${fragment.name}`] = {
      type: fragment,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      }
    }

    // add mutation fields and inputs
    mutation_fields[`put${fragment.name}`] = {
      type: fragment,
      args: {
        input: {
          type: new GraphQLNonNull(createInput(fragment, true))
        }
      }
    }
  });


  const new_schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: query_fields
    }),

    mutation: new GraphQLObjectType({
      name: 'RootMutation',
      fields: mutation_fields
    })
  });

  const schema = mergeSchemas({
    schemas: [
      graphqlSchemaObj,
      new_schema
    ],
  });

  return printSchema(schema);
}
