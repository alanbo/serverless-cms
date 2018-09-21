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