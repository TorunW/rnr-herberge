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
      telephone: 'Phone number',
      room: 'Select room',
      guest_count: 'People',
      arrival: 'Arrival',
      departure: 'Departure',
      notes: 'Write us, if you have any further questions',
      full_name: 'Your Name',
      msg: 'Your message',
    },
    DE: {
      first_name: 'Vorname',
      last_name: 'Name',
      email: 'Email',
      telephone: 'Telefonnummer',
      room: 'Zimmer',
      guest_count: 'Personen',
      arrival: 'Ankunft',
      departure: 'Abreise',
      notes: 'Schreiben sie uns wenn sie weitere Fragen haben.',
      full_name: 'Vorname/Name',
      msg: 'Deine Nachricht',
    },
  },
  formErrors: {
    EN: {
      name_error: 'Fill in your name, please.',
      email_error: 'Please fill in a valid Email.',
      telephone_error: 'Please fill in a valid phone number.',
      room_error: 'Please choose a room.',
      guest_error: 'Please choose how many persons are staying.',
      date_error: 'Please select a valid date.',
    },
    DE: {
      name_error: 'Fügen sie ihre name ein.',
      email_error: 'Ihre eingegebene Emailadresse ist fehlerhaft.',
      telephone_error: 'Ihre eingegebene Telefonnummer ist fehlerhaft.',
      room_error: 'Bitte wählen sie eine Zimmer.',
      guest_error: 'Bitte geben sie die Zahl der Gäste ein.',
      date_error: 'Bitte geben sie eine Datum ein.',
    },
  },
  formSubmit: {
    EN: { submit_booking: 'Book the room', submit_message: 'Send message' },
    DE: { submit_booking: 'Zimmer buchen', submit_message: 'Absenden' },
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
