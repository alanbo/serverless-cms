import {
  put_text,
  remove_text,
  get_text_list
} from '../actions/types';

function removeHtml(html) {
  const div = document.createElement('div');

  div.innerHTML = html;

  return div.textContent.substring(0, 60);
}


function textList(state = {}, action) {

  switch (action.type) {
    case get_text_list: {
      const texts = {};

      action.payload.forEach(text => {
        texts[text.id] = text;
        texts[text.id].snippet = removeHtml(text.text);
      });

      return texts;
    }

    case put_text: {
      const new_text = Object.assign({ snippet: removeHtml(action.payload.text) }, action.payload);
      const texts = Object.assign({}, state, { [action.payload.id]: new_text });

      return texts;
    }

    case remove_text: {
      const texts = Object.assign({}, state);

      delete texts[action.payload];

      return texts;
    }



    default:
      return state
  }
}

export default textList;