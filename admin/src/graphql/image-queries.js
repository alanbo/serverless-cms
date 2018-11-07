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
    images {
      id
    }
    name
  }
}
`;

export const addGallery = `
mutation AddGallery($name: String!) {
  addGallery(name: $name) {
    id
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
      images {
        id
      }
    }
  }
`;

export const removeImageFromGallery = `
  mutation RemoveImageFromGallery($image_number: Int!, $id: ID!) {
    removeImageFromGallery(image_number: $image_number, id: $id) {
      name
      images {
        id
      }
    }
  }
`;

export const reorderImagesInGallery = `
  mutation ReorderImagesInGallery($image_ids: [ID]!, $id: ID!) {
    reorderImagesInGallery(image_ids: $image_ids, id: $id) {
      id
      name
      images {
        id
      }
    }
  }
`;
