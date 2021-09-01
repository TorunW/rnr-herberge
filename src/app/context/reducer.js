export const appInitialState = {
  language:
    window.location.search !== ''
      ? window.location.search.split('language=')[1]
      : 'DE',
  pageId: null,
  translatedPageId: null,
  formLabels: {
    EN: {
      first_name: 'First name',
      last_name: 'Last name',
      email: 'Email',
      telephone: 'Telephone number',
      room: 'Select room',
      guest_count: 'Number of people staying',
      arrival: 'Arrival',
      departure: 'Departure',
      notes: 'Write us, if you have any questions',
      name: 'Your Name',
      msg: 'Your message',
    },
    DE: {
      first_name: 'Vorname',
      last_name: 'Name',
      email: 'Email',
      telephone: 'Telefon',
      room: 'Wähle ein Zimmer bitte',
      guest_count: 'Anzahl von Personen',
      arrival: 'Ankunft',
      departure: 'Abreise',
      notes: 'Schreiben Sie uns falls Sie noch zuzätslige Fragen haben.',
      name: 'Vorname/Name',
      msg: 'Deine Nachricht',
    },
  },
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
