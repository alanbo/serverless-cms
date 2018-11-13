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

export const putPage = `
  mutation putPage($page_data: PageInput!) {
    putPage(page_data: $page_data) {
      id
      name
      page_type
      fragments
    }
  }
`;

export const getPageList = `
  {
    getPageList {
      id
      name
      fragments
      page_type
    }
  }
`;

export const removePage = `
  mutation removePage($id: ID!) {
    removePage(id: $id) {
      id
    }
  }
`;