import { useState } from 'react';
import $ from 'jquery';

function Messages(props) {
  // state var for the fields and error messages
  const [fullName, setFullName] = useState('');
  const [fullNameError, setFullNameError] = useState();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState();
  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState();
  const [sentMessage, setSentMessage] = useState(false);

  // submit form
  function submitForm() {
    if (formValidation()) {
      // create an object for the message, with name email msg
      const newMessage = {
        name: fullName,
        email,
        msg: message,
      };

      $.ajax({
        url: '/db/message/',
        method: 'POST',
        data: newMessage,
      }).done(function (res) {
        setSentMessage(true);
        setFullName('');
        setEmail('');
        setMessage('');
      });
    }
  }
  // form validation
  function formValidation() {
    let isValidated = true;
    if (fullName.length < 1) {
      setFullNameError(true);
      isValidated = false;
    } else {
      setFullNameError(false);
    }

    const patternEmail =
      /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+.([a-zA-Z])+([a-zA-Z])+/;
    const isValidEmail = patternEmail.test(email);
    if (!isValidEmail) {
      setEmailError(true);
      isValidated = false;
    } else {
      setEmailError(false);
    }

    if (message.length < 1) {
      setMessageError(true);
      isValidated = false;
    } else {
      setMessageError(false);
    }

    return isValidated;
  }

  // error messages display
  let fullNameErrorDisplay;
  if (fullNameError === true) {
    fullNameErrorDisplay = <p className="error">Fill in your name, please.</p>;
  }

  let emailErrorDisplay;
  if (emailError === true) {
    emailErrorDisplay = <p className="error">Please fill in a valid email</p>;
  }

  let messageErrorDisplay;
  if (messageError === true) {
    messageErrorDisplay = <p className="error">Message can't be empty</p>;
  }

  return (
    <div className="booking-form">
      <form>
        <div className="user-box">
          <input
            className={
              'full-name-input' + (fullName.length > 0 ? ' filled' : '')
            }
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            type="text"
          />
          <label>Your name</label>
          {fullNameErrorDisplay}
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
          <textarea
            className={'message-input' + (message.length > 0 ? ' filled' : '')}
            value={message}
            onChange={e => setMessage(e.target.value)}
            type="text"
          ></textarea>
          <label>Write us, if you have any questions or feedback</label>
          {messageErrorDisplay}
        </div>

        <div className="submit">
          <a className="submit-btn" onClick={submitForm}>
            Send message
          </a>
        </div>
      </form>
    </div>
  );
}

export default Messages;
