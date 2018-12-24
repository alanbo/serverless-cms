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

export const head_settings_props = `
  id
  name
  lastModified
  is_deleted
  title
  description
  keywords
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

export const resize_images_mutation = `
mutation ResizeImages($paths: [String!]!) {
  resizeImages(paths: $paths) {
    ${image_props}
  }
}
`;

export const restore_fragment_mutation = `
mutation RecoverFragment($id: ID!) {
  recoverFragment(id: $id)
}`;

export const permanently_delete_fragments_mutation = `
mutation PermanentlyDeleteFragments($ids: [ID!]!) {
  permanentlyDeleteFragments(ids: $ids)
}`;

export const get_head_settings_query = `
{
  getHeadSettings(id: "head_settings") {
    ${head_settings_props}
  }
}`;

export const put_head_settings_mutation = `
mutation PutHeadSettings($input: HeadSettingsInput!) {
  putHeadSettings(input: $input) {
    ${head_settings_props}
  }
}`;