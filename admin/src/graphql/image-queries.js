export const getImageList = `
{
  getImageList {
    id
    filename
    paths {
      path
      type
    }
  }
}
`;

export const getGalleryList = `
{
  getGalleryList {
    id
    images
    name
  }
}
`;

export const addGallery = `
mutation AddGallery($name: String!) {
  addGallery(name: $name) {
    id
    images
    name
  }
}
`;

export const removeGallery = `
mutation RemoveGallery($id: ID!) {
  removeGallery(id: $id) {
    name
  }
}
`;

export const removeImage = `
  mutation RemoveImage($id: ID!) {
    removeImage(id: $id) {
      filename
    }
  }
`;