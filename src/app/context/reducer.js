export const appInitialState = {
  language: 'de',
  pageId: null,
};

function AppReducer(state, action) {
  switch (action.type) {
    case 'SET_LANGUAGE': {
      return { ...state, language: action.val };
    }
    case 'SET_PAGEID': {
      return { ...state, pageId: action.val };
    }
    default: {
      return state;
    }
  }
}

export default AppReducer;
