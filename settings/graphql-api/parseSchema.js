const {
  buildSchema,
  GraphQLList,
  GraphQLObjectType
} = require("graphql");
const fs = require('fs');
const path = require('path');

const sdlString = fs.readFileSync(path.resolve(__dirname, './schema.graphql')).toString('utf8');
const graphqlSchemaObj = buildSchema(sdlString);
const type_map = graphqlSchemaObj.getTypeMap();
const type_map_keys = Object.keys(type_map);

const all_types = type_map_keys.map(key => {
  return type_map[key];
});



const fragments = graphqlSchemaObj.getPossibleTypes(graphqlSchemaObj.getType('Fragment'));

const config = {};

fragments.forEach(fragment => {
  config[fragment.name] = {
    is_fragment: true,
    nestedListFields: [],
    nestedFields: []
  };
});

const ignored = ['Query', 'Mutation', 'Subscription'];
all_types.forEach(fragment => {

  if (!(fragment instanceof GraphQLObjectType) || ignored.includes(fragment.name)) {
    return;
  }

  const fields = fragment.getFields();

  Object.keys(fields)
    .map(field_key => fields[field_key])
    .forEach(field => {
      if (field.type instanceof GraphQLList) {
        if (field.type.ofType instanceof GraphQLObjectType) {
          const is_fragment = !!field.type.ofType.getInterfaces().filter((interface) => interface.name === 'Fragment').length;

          if (is_fragment) {
            if (config[fragment.name]) {
              config[fragment.name].nestedListFields.push(field.name);
            } else {
              config[fragment.name] = { nestedListFields: [field.name] }
            }
          }
        }
      }
    })

  // .getFields().images.type.ofType.getInterfaces()

});

console.log(config);


// graphqlSchemaObj._implementations.Fragment.forEach(type => {
//   console.log(type.name);

//   const input = graphqlSchemaObj._typeMap[`${type.name}Input`]

//   if (!input) {
//     return;
//   }
//   const field_names = Object.keys(input._fields);
//   console.log(field_names);
// });

// const type_map = graphqlSchemaObj._typeMap;

// const introspection_schema = parse(sdlString);
// console.log(introspection_schema);

// const result = graphqlSync(graphqlSchemaObj, introspectionQuery).data;

// console.log(result);