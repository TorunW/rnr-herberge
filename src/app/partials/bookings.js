import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  cloneElement,
} from 'react';
import $ from 'jquery';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../style/bookings.css';
import { Context } from '../context/context-provider';

// 2 select 1 for room and then for guest, with the right amount of options, number
// useeffect that bound to the room state var, set the guest
// another state var
function Bookings(props) {
  const { appState, appDispatch } = useContext(Context);

  const previousUnavailableRooms = usePrevious(appState.unavailableRooms);

  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [telephone, setTelephone] = useState('');
  const [telephoneError, setTelephoneError] = useState(false);
  const [room, setRoom] = useState('');
  const [roomError, setRoomError] = useState(false);
  const [guest, setGuest] = useState('');
  const [guestError, setGuestError] = useState(false);
  const [options, setOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateError, setDateError] = useState(false);
  const [message, setMessage] = useState('');
  const [bookingSent, setBookingSent] = useState(false);

  useEffect(() => {
    addRoomsToBooking();
  }, [appState]);

  function addRoomsToBooking() {
    let newRoomArray = [];
    let newGuestArray = [];

    for (var i in appState.unavailableRooms) {
      newRoomArray.push(i);
      newGuestArray.push(appState.unavailableRooms[i]);
      console.log(newGuestArray, 'newguest', newRoomArray, 'newroom');
    }

    setRoom(JSON.stringify(newRoomArray));
    setGuest(JSON.stringify(newGuestArray));
  }

  function submitForm() {
    if (formValidation()) {
      // create an object for the message, with name email msg
      const newBooking = {
        first_name: firstName,
        last_name: lastName,
        email,
        telephone,
        room,
        guest_count: guest,
        arrival: startDate,
        departure: endDate,
        notes: message,
      };

      $.ajax({
        url: '/db/bookings/',
        method: 'POST',
        data: newBooking,
      }).done(function (res) {
        setBookingSent(true);
        setFirstName('');
        setLastName('');
        setEmail('');
        setTelephone('');
        setRoom('');
        setGuest('');
        setStartDate(null);
        setEndDate(null);
        setMessage('');
        appDispatch({ type: 'SET_FORM_SUBMITTED', val: true });
      });
    }
  }

  function formValidation() {
    // validation for each field
    // first name
    let isValidated = true;
    if (firstName.length < 1) {
      setFirstNameError(true);
      isValidated = false;
    } else {
      setFirstNameError(false);
    }

    // last name
    if (lastName.length < 1) {
      setLastNameError(true);
      isValidated = false;
    } else {
      setLastNameError(false);
    }
    // email
    const patternEmail =
      /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+.([a-zA-Z])+([a-zA-Z])+/;
    const isValidEmail = patternEmail.test(email);
    if (!isValidEmail) {
      setEmailError(true);
      isValidated = false;
    } else {
      setEmailError(false);
    }
    // phone
    const telPattern =
      /([0-9\s\-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
    const isValidNr = telPattern.test(telephone);
    if (!isValidNr) {
      setTelephoneError(true);
      isValidated = false;
    } else {
      setTelephoneError(false);
    }
    //  room
    if (room.length === 0 || room.indexOf('null') > -1) {
      setRoomError(true);
      isValidated = false;
    } else {
      setRoomError(false);
    }
    // guest
    if (guest.length === 0 || guest.indexOf('null') > -1) {
      setGuestError(true);
      isValidated = false;
    } else {
      setGuestError(false);
    }
    // arrival departure
    if (endDate < startDate || startDate === null) {
      setDateError(true);
      isValidated = false;
    } else {
      setDateError(false);
    }

    return isValidated;
  }

  // error displays
  let nameErrorDisplay;
  if (firstNameError === true || lastNameError === true) {
    nameErrorDisplay = (
      <p className="error">
        {appState ? appState.formErrors[appState.language].name_error : ''}
      </p>
    );
  }
  let emailErrorDisplay;
  if (emailError === true) {
    emailErrorDisplay = (
      <p className="error">
        {appState ? appState.formErrors[appState.language].email_error : ''}
      </p>
    );
  }

  let telephoneErrorDisplay;
  if (telephoneError === true) {
    telephoneErrorDisplay = (
      <p className="error">
        {appState ? appState.formErrors[appState.language].telephone_error : ''}
      </p>
    );
  }

  let dateErrorDisplay;
  if (dateError === true) {
    dateErrorDisplay = (
      <p className="error">
        {appState ? appState.formErrors[appState.language].date_error : ''}
      </p>
    );
  }

  let displaySuccessMessage;
  if (bookingSent === true) {
    displaySuccessMessage = (
      <div>
        <p>
          {appState
            ? appState.formLabels[appState.language].success_booking
            : ''}
        </p>
      </div>
    );
  }

  return (
    <div className="booking-form">
      <form>
        <div className="field-box">
          <div className="user-box">
            <input
              className={
                'first-name-input' + (firstName.length > 0 ? ' filled' : '')
              }
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              type="text"
            />
            <label>
              {appState
                ? appState.formLabels[appState.language].first_name
                : ''}
            </label>
            {nameErrorDisplay}
          </div>

          <div className="user-box">
            <input
              className={
                'last-name-input' + (lastName.length > 0 ? ' filled' : '')
              }
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              type="text"
            />
            <label>
              {appState ? appState.formLabels[appState.language].last_name : ''}
            </label>
            {nameErrorDisplay}
          </div>

          <div className="user-box">
            <input
              className={'email-input' + (email.length > 0 ? ' filled' : '')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
            />
            <label>
              {appState ? appState.formLabels[appState.language].email : ''}
            </label>
            {emailErrorDisplay}
          </div>

          <div className="user-box">
            <input
              className={
                'telephone-input' + (telephone.length > 0 ? ' filled' : '')
              }
              value={telephone}
              onChange={e => setTelephone(e.target.value)}
              type="tel"
            />
            <label>
              {appState ? appState.formLabels[appState.language].telephone : ''}
            </label>
            {telephoneErrorDisplay}
          </div>
        </div>

        <div className="field-box">
          <div className="user-box">
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={startDate}
              onChange={date => setStartDate(date)}
              minDate={new Date()}
              withPortal
            />
            <label className={'date' + (startDate ? '-filled' : '')}>
              {appState ? appState.formLabels[appState.language].arrival : ''}
            </label>
            {dateErrorDisplay}
          </div>

          <div className="user-box">
            <DatePicker
              className="date-picker"
              dateFormat="dd/MM/yyyy"
              selected={endDate}
              onChange={date => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              withPortal
            />
            <label className={'date' + (endDate ? '-filled' : '')}>
              {appState ? appState.formLabels[appState.language].departure : ''}
            </label>
          </div>
        </div>

        <SelectRoomFieldList
          room={room}
          setRoom={setRoom}
          roomError={roomError}
          guest={guest}
          setGuest={setGuest}
          guestError={guestError}
          setOptions={setOptions}
          options={options}
        />

        <div className="user-box message">
          <textarea
            className={'message-input' + (message.length > 0 ? ' filled' : '')}
            value={message}
            onChange={e => setMessage(e.target.value)}
            type="text"
          ></textarea>
          <label className="message-label">
            {appState ? appState.formLabels[appState.language].notes : ''}
          </label>
        </div>

        <div className="btn-wrapper">
          <a className="submit-btn" onClick={submitForm}>
            {appState
              ? appState.formSubmit[appState.language].submit_booking
              : ''}
          </a>
        </div>
        {displaySuccessMessage}
      </form>
    </div>
  );
}

function SelectRoomFieldList(props) {
  const { appState, appDispatch } = useContext(Context);
  const [showAddRoomButton, setAddShowRoomButton] = useState(false);
  const [roomSelectArray, setRoomSelectArray] = useState([0]);

  useEffect(() => {
    let newShowAddRoomButtonValue;
    for (var i in appState.unavailableRooms) {
      if (appState.unavailableRooms[i] === null) {
        newShowAddRoomButtonValue = false;
      } else {
        newShowAddRoomButtonValue = true;
      }
    }
    setAddShowRoomButton(newShowAddRoomButtonValue);
    if (appState.isFormSubmitted === true) {
      setRoomSelectArray([0]);
    }
  }, [appState]);

  function onSetRoom(val, previousSelectedRoom) {
    appDispatch({
      type: 'SET_UNAVAILABLEROOMS',
      val,
      previousSelectedRoom,
    });
  }

  function onSetGuest(guests, room) {
    appDispatch({
      type: 'SET_GUESTS_IN_ROOM',
      guests,
      room,
    });
  }

  function onAddRoomClick() {
    if (roomSelectArray.length < 6) {
      const newRoomSelectArray = [...roomSelectArray];
      newRoomSelectArray.push(roomSelectArray.length);
      setRoomSelectArray(newRoomSelectArray);
    }
  }

  let displayAddRoomButton;
  if (showAddRoomButton === true && roomSelectArray.length < 6) {
    displayAddRoomButton = (
      <div className="btn-wrapper">
        <a className="add-btn" onClick={onAddRoomClick}>
          {appState.formSubmit[appState.language].add_room}
        </a>
      </div>
    );
  }

  let roomSelectArrayDisplay = roomSelectArray.map((rs, i) => (
    <RoomSelectFormField {...props} setRoom={onSetRoom} setGuest={onSetGuest} />
  ));

  return (
    <div className="new-room-field-container">
      <div id="select-room-list">{roomSelectArrayDisplay}</div>
      {displayAddRoomButton}
    </div>
  );
}

function RoomSelectFormField(props) {
  const { appState, appDispatch } = useContext(Context);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedGuest, setSelectedGuest] = useState('');
  const [options, setOptions] = useState([]);
  const previousSelectedRoom = usePrevious(selectedRoom);

  const setRoom = props.setRoom;
  const roomError = props.roomError;
  const setGuest = props.setGuest;
  const guestError = props.guestError;

  useEffect(() => {
    let newOptions = [];
    if (selectedRoom === '1') {
      newOptions = [1, 2, 3];
    } else if (selectedRoom === '3') {
      newOptions = [1, 2, 3, 4, 5];
    } else if (selectedRoom === '4') {
      newOptions = [1, 2, 3];
    } else if (selectedRoom === '5') {
      newOptions = [1, 2];
    } else if (selectedRoom === '6') {
      newOptions = [1, 2, 3, 4, 5];
    } else if (selectedRoom === '7') {
      newOptions = [1, 2, 3];
    }
    setOptions(newOptions);

    if (selectedRoom !== previousSelectedRoom) setSelectedGuest('');
  }, [selectedRoom]);

  useEffect(() => {
    if (appState.isFormSubmitted === true) {
      setSelectedRoom('');
      setSelectedGuest('');
    }
  }, [appState]);

  function onSetSelectedRoom(val) {
    setRoom(val, previousSelectedRoom);
    setSelectedRoom(val);
  }

  function onSetSelectedGuest(val) {
    setGuest(val, selectedRoom);
    setSelectedGuest(val);
  }

  let numberOfGuests = options.map((op, i) => (
    <option value={op.options} key={i}>
      {op}
    </option>
  ));

  let roomList = appState.availableRooms.map((rl, i) => {
    let isShown = true;
    if (appState.unavailableRooms[rl] !== undefined) {
      isShown = false;

      if (parseInt(selectedRoom) === rl) {
        isShown = true;
      }
    }
    if (isShown) {
      return (
        <option value={rl} key={i}>
          {rl}
        </option>
      );
    }
  });

  let roomErrorDisplay;
  if (roomError === true) {
    roomErrorDisplay = (
      <p className="error">
        {appState ? appState.formErrors[appState.language].room_error : ''}
      </p>
    );
  }

  let guestErrorDisplay;
  if (guestError === true) {
    guestErrorDisplay = (
      <p className="error">
        {appState ? appState.formErrors[appState.language].guest_error : ''}
      </p>
    );
  }

  return (
    <div className="new-room-field">
      <div className="user-box">
        <select
          className={'room-select' + (selectedRoom !== '' ? ' filled' : '')}
          value={selectedRoom}
          onChange={e => onSetSelectedRoom(e.target.value)}
        >
          <option value=""></option>
          {roomList}
        </select>
        <span className="span-1">
          <span className="span-2">
            <span className="span-3">
              <span className="span-4"></span>
            </span>
          </span>
        </span>
        <label>
          {appState ? appState.formLabels[appState.language].room : ''}
        </label>
        {roomErrorDisplay}
      </div>

      <div className="user-box">
        <select
          className={
            'guest-select' + (selectedGuest.length > 0 ? ' filled' : '')
          }
          value={selectedGuest}
          onChange={e => onSetSelectedGuest(e.target.value)}
        >
          <option value=""></option>
          {numberOfGuests}
        </select>
        <label>
          {appState ? appState.formLabels[appState.language].guest_count : ''}
        </label>
        {guestErrorDisplay}
      </div>
    </div>
  );
}

// Hook use Previous
const usePrevious = value => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref

  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
};

export default Bookings;
