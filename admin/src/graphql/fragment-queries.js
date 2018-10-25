export const putText = `
  mutation addText($text: String!) {
    putText(text: $text) {
      id
      text
    }
  }
`;

export const getTextList = `
  {
    getTextList {
      id
      text
    }
  }
`;