export const putText = `
  mutation addText($text: String!, $is_rich: Boolean) {
    putText(text: $text, is_rich: $is_rich) {
      id
      text
      is_rich
    }
  }
`;

export const getTextList = `
  {
    getTextList {
      id
      text
      is_rich
    }
  }
`;

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
`