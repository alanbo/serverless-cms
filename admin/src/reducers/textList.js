import {
  put_text,
  remove_text
} from '../actions/types';


function textList(state = {}, action) {

  switch (action.type) {
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