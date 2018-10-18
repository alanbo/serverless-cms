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

export const addImagesToGallery = `
  mutation addImagesToGallery($image_ids: [ID]!, $id: ID!) {
    addImagesToGallery(image_ids: $image_ids, id: $id) {
      name
      images
    }
  }
`;
