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
      guest_count: 'Add guests',
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
      room: 'Zimmer wählen',
      guest_count: 'Gäste',
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
      message_error: `Message can't be empty.`,
    },
    DE: {
      name_error: 'Fügen sie ihre name ein.',
      email_error: 'Ihre eingegebene Emailadresse ist fehlerhaft.',
      telephone_error: 'Ihre eingegebene Telefonnummer ist fehlerhaft.',
      room_error: 'Bitte wählen sie eine Zimmer.',
      guest_error: 'Bitte geben sie die Zahl der Gäste ein.',
      date_error: 'Bitte geben sie eine Datum ein.',
      message_error: 'Nachricht darf nicht leer sein.',
    },
  },
  formSubmit: {
    EN: {
      submit_booking: 'Book the room',
      submit_message: 'Send message',
      success_booking:
        'Booking sent! You will recive an email soon with confirmation and payment details',
      success_message: 'Thank you for your message!',
      add_room: 'Add another room',
    },
    DE: {
      submit_booking: 'Zimmer buchen',
      submit_message: 'Absenden',
      success_booking:
        'Buchung durchgeführt! Sie bekommen bald einem Email mit eine Bestätigung und weitere Details zum Zahlung des Zimmer',
      success_message: 'Danke für deine Nachricht!',
      add_room: 'Weitere Zimmer hinzfügen',
    },
  },
  emailLanguage: {
    EN: {
      booking_language: 'You have a new booking request',
      message_language: 'message',
    },
    DE: {
      booking_language: 'Ihr habt eine neue Buchungsanfrage',
      message_language: 'Nachricht',
    },
  },

  availableRooms: [1, 3, 4, 5, 6, 7],
  unavailableRooms: {},
  isFormSubmitted: false,
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
    case 'SET_UNAVAILABLEROOMS': {
      let newUnavailableRooms = {};
      if (state.unavailableRooms[action.previousSelectedRoom] !== undefined) {
        for (var i in state.unavailableRooms) {
          if (i !== action.previousSelectedRoom) {
            newUnavailableRooms[i] = state.unavailableRooms[i];
          }
        }
      } else newUnavailableRooms = state.unavailableRooms;

      newUnavailableRooms[action.val] = null;

      return { ...state, unavailableRooms: newUnavailableRooms };
    }
    case 'SET_GUESTS_IN_ROOM': {
      let newUnavailableRooms = state.unavailableRooms;
      newUnavailableRooms[action.room] = action.guests;
      return { ...state, unavailableRooms: newUnavailableRooms };
    }
    case 'SET_FORM_SUBMITTED': {
      return { ...state, isFormSubmitted: action.val };
    }
    default: {
      return state;
    }
  }
}

export default AppReducer;
