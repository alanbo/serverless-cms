export const putText = `
  mutation addText($text: String!, $is_rich: Boolean) {
    putText(text: $text, is_rich: $is_rich) {
      id
      text
      is_rich
    }
  }
`;

// export const getTextList = `
//   {
//     getTextList {
//       id
//       text
//       is_rich
//     }
//   }
// `;

export const updateText = `
  mutation UpdateText($text: String!, $id: ID!) {
    updateText(text: $text, id: $id) {
      id
      text
      is_rich
    }
  }
`;

export const removeText = `
  mutation RemoveText($id: ID!) {
    removeText(id: $id) {
      id
      text
    }
  }
`;

// sample putMenu input:
// {	
//   "id": "27e668a6-ea0a-4565-a6d9-edbd51b9c986",
//   "menu": {
//     "name": "main_menu",
//     "items": [
//       {
//         "name": "category1",
//         "items": [
//           {
//             "name": "name 1",
//             "href": "href 1"
//           },
//          {
//             "name": "name 1",
//             "href": "href 1",
//           	"items": [
//               {
//                 "name": "additional",
//                 "href": "http"
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// }
export const putMenu = `
  mutation PutMenu($menu: MenuInput!, $id: ID) {
    putMenu(menu: $menu, id: $id) {
      id
      name
      items {
        name
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
  }
`;


// export const getMenuList = `
//   {
//     getMenuList {
//       id
//       name
//       items {
//         name
//         href
//         items {
//           name
//           href
//           items {
//             name
//             href
//             items {
//               name
//               href
//             }
//           }
//         }
//       }
//     }
//   }
// `;

export const removeMenu = `
  mutation RemoveMenu($id: ID!) {
    removeMenu(id: $id) {
      id
      name
      items {
        name
        items {
          name
          href
        }
      }
    }
  }
`;

export const removeFragment = `
  mutation RemoveFragment($id: ID!) {
    removeFragment(id: $id) {
      id
    }
  }
`;

export const getMenuList = `
{
  menu: getMenuList {
    id
    name
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
    is_rich
  }
}`;
  
export const getImageList = `
{
  image: getImageList {
    id
    name
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
    fragments
    page_type
  }
}`;