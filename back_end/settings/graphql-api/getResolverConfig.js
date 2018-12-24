const {
  buildSchema,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull
} = require("graphql");


function getResolverConfig(sdlString) {
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
      nested_list_fields: [],
      nested_fields: []
    };
  });

  const ignored = ['Query', 'Mutation', 'Subscription'];

  function check_fragment(node, field, fragment, is_list) {
    if (!node || !node.getInterfaces) {
      return;
    }

    const is_fragment = !!node.getInterfaces().filter((interface) => interface.name === 'Fragment').length;

    if (is_fragment) {
      const fields = is_list ? 'nested_list_fields' : 'nested_fields';

      if (config[fragment.name]) {
        config[fragment.name][fields].push(field.name);
      } else {
        config[fragment.name] = { nested_fields: [], nested_list_fields: [] }
        config[fragment.name][fields] = [field.name];
      }
    }
  }

  // scan all the user provided types and add fields of Fragment interface to the resolver config
  all_types.forEach(fragment => {
    if (!(fragment instanceof GraphQLObjectType) || ignored.includes(fragment.name)) {
      return;
    }

    const fields = fragment.getFields();

    Object.keys(fields)
      .map(field_key => fields[field_key])
      .forEach(field => {
        let to_check_fragment;
        let is_list = true;

        switch (field.type.constructor) {
          // if it's a list
          case GraphQLList:
            // and if it's non null
            if (field.type.ofType.constructor === GraphQLNonNull) {
              // check the child of non null
              to_check_fragment = field.type.ofType.ofType;
              // and if it's an object type
            } else if (field.type.ofType.constructor === GraphQLObjectType) {
              // check the object type
              to_check_fragment = field.type.ofType;
            }
            break;
          // it it's an object type
          case GraphQLObjectType:
            // check the object type
            to_check_fragment = field.type;
            is_list = false;
            break;
          // if it's non null
          case GraphQLNonNull:
            // and it wrapps a list
            if (field.type.ofType.constructor === GraphQLList) {
              // and the list wrapps an object type
              if (field.type.ofType.ofType.constructor === GraphQLObjectType) {
                // check the object type
                to_check_fragment === field.type.ofType.ofType;
                // and the list wrapps non null
              } else if (field.type.ofType.ofType.constructor === GraphQLNonNull) {
                // if non null wrapps an object type
                if (field.type.ofType.ofType.ofType.constructor === GraphQLObjectType) {
                  // check the object type
                  to_check_fragment = field.type.ofType.ofType.ofType;
                }
              }
              // and it wrapps an object type
            } else if (field.type.ofType.constructor === GraphQLObjectType) {
              // check the object type
              to_check_fragment = field.type.ofType;
              is_list = false;
            }
            break;
          default:
            return
        }

        check_fragment(to_check_fragment, field, fragment, is_list);
      })
  });

  // convert config to an array of object with type property
  return Object.keys(config).map(type => ({ type, ...config[type] }));
}

module.exports = getResolverConfig;
