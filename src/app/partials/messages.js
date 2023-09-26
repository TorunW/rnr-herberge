import { useState, useContext, useEffect } from 'react';
import $ from 'jquery';
import { Context } from '../context/context-provider';

function Messages(props) {
  const { appState, appDispatch } = useContext(Context);

  // state var for the fields and error messages
  const [fullName, setFullName] = useState('');
  const [fullNameError, setFullNameError] = useState();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState();
  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState();
  const [sentMessage, setSentMessage] = useState(false);

  useEffect(() => {
    if (sentMessage === true) {
      setTimeout(() => {
        setSentMessage(false);
        window.location.reload();
      }, 10000);
    }
  }, [sentMessage]);

  // submit form
  function submitForm() {
    if (formValidation()) {
      // create an object for the message, with name email msg
      const newMessage = {
        name: fullName,
        email,
        msg: message,
        language: appState.emailLanguage[appState.language].message_language,
      };

      $.ajax({
        url: 'http://localhost:3000/db/message/',
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
    fullNameErrorDisplay = (
      <p className="error">
        {appState ? appState.formErrors[appState.language].name_error : ''}
      </p>
    );
  }

  let emailErrorDisplay;
  if (emailError === true) {
    emailErrorDisplay = (
      <p className="error">
        {appState ? appState.formErrors[appState.language].name_error : ''}
      </p>
    );
  }

  let messageErrorDisplay;
  if (messageError === true) {
    messageErrorDisplay = (
      <p className="error">
        {appState ? appState.formErrors[appState.language].message_error : ''}
      </p>
    );
  }

  let displaySuccessMessage;
  if (sentMessage === true) {
    displaySuccessMessage = (
      <div>
        <p className="success">
          {appState
            ? appState.formSubmit[appState.language].success_message
            : ''}
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        'booking-form message-form' + (sentMessage === true ? ' sent' : '')
      }
    >
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
          <label>
            {appState ? appState.formLabels[appState.language].full_name : ''}
          </label>
          {fullNameErrorDisplay}
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
          <textarea
            className={'message-input' + (message.length > 0 ? ' filled' : '')}
            value={message}
            onChange={e => setMessage(e.target.value)}
            type="text"
          ></textarea>
          <label>
            {appState ? appState.formLabels[appState.language].msg : ''}
          </label>
          {messageErrorDisplay}
        </div>

        <div className="submit">
          <div className="btn-wrapper">
            <a className="submit-btn" onClick={submitForm}>
              {appState
                ? appState.formSubmit[appState.language].submit_message
                : ''}
            </a>
          </div>
        </div>
        {displaySuccessMessage}
      </form>
    </div>
  );
}

export default Messages;
