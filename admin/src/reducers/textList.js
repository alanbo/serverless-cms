import {
  put_text,
  remove_text,
  get_text_list
} from '../actions/types';


function textList(state = {}, action) {

  switch (action.type) {
    case get_text_list: {
      const texts = {};

      action.payload.forEach(text => {
        texts[text.id] = text;
      });

      return texts;
    }

    case put_text: {
      const texts = Object.assign({}, state, { [action.payload.id]: action.payload });

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