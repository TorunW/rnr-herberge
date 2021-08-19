console.log(window.location.search.split('language=')[1]);
export const appInitialState = {
  language:
    window.location.search !== ''
      ? window.location.search.split('language=')[1]
      : 'de',
  pageId: null,
  translatedPageId: null,
};

function AppReducer(state, action) {
  switch (action.type) {
    case 'SET_LANGUAGE': {
      return { ...state, language: action.val };
    }
    case 'SET_PAGEID': {
      return { ...state, pageId: action.val };
    }
    case 'SET_TRANSLATEDPAGEID': {
      return { ...state, translatedPageId: action.val };
    }
    default: {
      return state;
    }
  }
}

export default AppReducer;
