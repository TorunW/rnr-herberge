import React, { useEffect, useState, useContext } from 'react';
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

  console.log(bookingSent, 'booking sent');

  useEffect(() => {
    let newOptions = [];
    if (room === '1') {
      newOptions = [1, 2, 3];
    } else if (room === '3') {
      newOptions = [1, 2, 3, 4, 5];
    } else if (room === '4') {
      newOptions = [1, 2, 3];
    } else if (room === '5') {
      newOptions = [1, 2];
    } else if (room === '6') {
      newOptions = [1, 2, 3, 4, 5];
    } else if (room === '7') {
      newOptions = [1, 2, 3];
    }
    setOptions(newOptions);
  }, [room]);

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
    if (room === '') {
      setRoomError(true);
      isValidated = false;
    } else {
      setRoomError(false);
    }
    // guest
    if (guest === '') {
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
    nameErrorDisplay = <p className="error">Fill in your name, please.</p>;
  }
  let emailErrorDisplay;
  if (emailError === true) {
    emailErrorDisplay = <p className="error">Please fill in a valid Email</p>;
  }

  let telephoneErrorDisplay;
  if (telephoneError === true) {
    telephoneErrorDisplay = (
      <p className="error">Please fill in a valid telephone number</p>
    );
  }

  let roomErrorDisplay;
  if (roomError === true) {
    roomErrorDisplay = <p className="error">Please choose a room</p>;
  }

  let numberOfGuests = options.map((op, i) => (
    <option value={op.options} key={i}>
      {op}
    </option>
  ));

  let guestErrorDisplay;
  if (guestError === true) {
    guestErrorDisplay = (
      <p className="error">Please choose how many persons are staying</p>
    );
  }

  let dateErrorDisplay;
  if (dateError === true) {
    dateErrorDisplay = <p className="error">Please select a valid date</p>;
  }

  // let displaySuccessMessage;
  // if ((bookingSent = true)) {
  //   displaySuccessMessage = (
  //     <div>
  //       <p>Booking sent!</p>
  //       <p>
  //         You will recive an email soon with confirmation and payment details
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className="booking-form">
      {/* {displaySuccessMessage} */}
      <form>
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
            {appState ? appState.formLabels[appState.language].first_name : ''}
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
          <label>Last name</label>
          {nameErrorDisplay}
        </div>

        <div className="user-box">
          <input
            className={'email-input' + (email.length > 0 ? ' filled' : '')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
          />
          <label>Email</label>
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
          <label>Telephone number</label>
          {telephoneErrorDisplay}
        </div>

        <div className="user-box">
          <select
            className={'room-select' + (room.length > 0 ? ' filled' : '')}
            value={room}
            onChange={e => setRoom(e.target.value)}
          >
            <option value=""></option>
            <option value="1">Room 1</option>
            <option value="3">Room 3</option>
            <option value="4">Room 4</option>
            <option value="5">Room 5</option>
            <option value="6">Room 6</option>
            <option value="7">Room 7</option>
          </select>
          <span className="span-1">
            <span className="span-2">
              <span className="span-3">
                <span className="span-4"></span>
              </span>
            </span>
          </span>
          <label>Select room</label>
          {roomErrorDisplay}
        </div>

        <div
          className={'user-box' + (numberOfGuests.length > 0 ? ' filled' : '')}
        >
          <label>Number of people staying</label>
          <select
            className="guest-select"
            value={guest}
            onChange={e => setGuest(e.target.value)}
          >
            <option value=""></option>
            {numberOfGuests}
          </select>

          {guestErrorDisplay}
        </div>

        <div className="user-box">
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={startDate}
            onChange={date => setStartDate(date)}
            minDate={new Date()}
            withPortal
          />
          <label className={'date' + (startDate ? '-filled' : '')}>
            Arrival
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
            Departure
          </label>
        </div>

        <div className="user-box">
          <textarea
            className={'message-input' + (message.length > 0 ? ' filled' : '')}
            value={message}
            onChange={e => setMessage(e.target.value)}
            type="text"
          ></textarea>
          <label>Write us, if you have any questions</label>
        </div>

        <div className="submit">
          <a className="submit-btn" onClick={submitForm}>
            Send booking
          </a>
        </div>
      </form>
    </div>
  );
}

export default Bookings;
