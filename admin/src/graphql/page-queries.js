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
  mutation putPage($id: ID, $name: String!, $type: String!, $fragments: [ID]) {
    putPage(id: $id, name: $name, type: $type, fragments: $fragments) {
      id
      name
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