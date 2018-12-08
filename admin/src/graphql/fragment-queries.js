export const removeFragmentMutation = `
  mutation DeleteFragment($id: ID!) {
    deleteFragment(id: $id)
  }
`;

export const menu_props = `
  id
  name
  lastModified
  is_deleted
  items {
    name
    href
    items {
      name
      href
      items {
        name
        href
        items {
          name
          href
        }
      }
    }
  }
`;

export const text_props = `
  id
  name
  text
  lastModified
  is_deleted
`;

export const image_props = `
  id
  name
  lastModified
  is_deleted
  filename
  paths {
    path
    type
  }
`;

export const gallery_props = `
  id
  name
  lastModified
  is_deleted
  images {
    id
  }
`;

export const page_props = `
  id
  name
  lastModified
  is_deleted
  fragments
  page_type
`;

export const putFragmentMutation = (type, gql_props) => `
mutation Put${type}($input: ${type}Input!) {
  put${type}(input: $input) {
    ${gql_props}
  }
}`;

export const getFragmentListQuery = (type, gql_props) => `
{
  get${type}List {
    ${gql_props}
  }
}`;