export const getPageTypeList = `
  {
    getPageTypeList {
      name
      inputs {
        title
        type
        name
      }
    }
  } 
`;


export const renderPages = `
  mutation RenderPage {
    renderPages
  }
`;