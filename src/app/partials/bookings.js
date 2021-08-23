import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../style/bookings.css';

// 2 select 1 for room and then for guest, with the right amount of options, number
// useeffect that bound to the room state var, set the guest
// another state var
function Bookings(props) {
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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [arrivalError, setArrivalError] = useState(false);
  const [departureError, setDepartureError] = useState(false);
  const [message, setMessage] = useState('');
  const [bookingSent, setBookingSent] = useState(false);

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
        setRoom();
        setGuest();

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
    // arrival
    if (endDate < startDate) {
      setDepartureError(true);
      isValidated = false;
    } else {
      setDepartureError(false);
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

  let departureErrorDisplay;
  if (departureError === true) {
    departureErrorDisplay = <p className="error">Please select a valid date</p>;
  }
  return (
    <div className="booking-form">
      <div className="first-name">
        <input
          className="first-name-input"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          type="text"
          placeholder="Your first name"
        />
        {nameErrorDisplay}
      </div>

      <div className="last-name">
        <input
          className="last-name-input"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          type="text"
          placeholder="Your last name"
        />
        {nameErrorDisplay}
      </div>

      <div className="email">
        <input
          className="email-input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        {emailErrorDisplay}
      </div>

      <div className="telephone-input">
        <input
          className="telephone-input"
          value={telephone}
          onChange={e => setTelephone(e.target.value)}
          type="tel"
          placeholder="Telephone number "
        />
        {telephoneErrorDisplay}
      </div>

      <div className="room">
        <select
          className="room-select"
          value={room}
          onChange={e => setRoom(e.target.value)}
        >
          <option value="">Select room</option>
          <option value="1">Room 1</option>
          <option value="3">Room 3</option>
          <option value="4">Room 4</option>
          <option value="5">Room 5</option>
          <option value="6">Room 6</option>
          <option value="7">Room 7</option>
        </select>
        {roomErrorDisplay}
      </div>

      <div className="guest">
        <select
          className="guest-select"
          value={guest}
          onChange={e => setGuest(e.target.value)}
        >
          <option value="">Persons</option>
          {numberOfGuests}
        </select>
        {guestErrorDisplay}
      </div>

      <div className="arrival">
        <div>Arrival</div>
        <DatePicker
          dateFormat="dd/MM/yyyy"
          selected={startDate}
          onChange={date => setStartDate(date)}
          minDate={new Date()}
          withPortal
        />
      </div>

      <div className="departure">
        <div>Departure</div>
        <DatePicker
          dateFormat="dd/MM/yyyy"
          selected={endDate}
          onChange={date => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          withPortal
        />
        {departureErrorDisplay}
      </div>

      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        type="text"
        placeholder="Write us, if you have any questions"
      ></input>

      <div className="submit">
        <a className="btn" onClick={submitForm}>
          Submit
        </a>
      </div>
    </div>
  );
}

export default Bookings;
