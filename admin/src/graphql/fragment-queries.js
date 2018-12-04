export const removeFragmentMutation = `
  mutation DeleteFragment($id: ID!) {
    deleteFragment(id: $id)
  }
`;

export const getMenuList = `
{
  menu: getMenuList {
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
  }
}`;

export const getTextList = `
{
  text: getTextList {
    id
    name
    text
    lastModified
    is_deleted
  }
}`;

export const getImageList = `
{
  image: getImageList {
    id
    name
    lastModified
    is_deleted
    filename
    paths {
      path
      type
    }
  }
}`;

export const getGalleryList = `
{
  gallery: getGalleryList {
    id
    name
    lastModified
    is_deleted
    images {
      id
    }
  }
}`;

export const getPageList = `
{
  page: getPageList {
    id
    name
    lastModified
    is_deleted
    fragments
    page_type
  }
}`;

export const putFragmentMutation = type => `
mutation Put${type}($input: ${type}Input!) {
  put${type}(input: $input) {
    id
    lastModified
  }
}`;