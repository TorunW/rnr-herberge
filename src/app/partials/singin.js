import $ from 'jquery';
import { useState } from 'react';
import '../style/signin.css';

function UserSignin(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function onSignin() {
    $.ajax({
      url: 'http://localhost:3000/db/signin/',
      type: 'POST',
      data: { username: username, password: password },
    }).done(function (res) {
      console.log(res, res);

      window.location.href = '/admin/';
    });
  }

  return (
    <div className="login-page">
      <div className="user-input">
        <label>Email/Username</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>

      <div className="user-input">
        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <a className="login-btn" onClick={onSignin}>
        Login
      </a>
    </div>
  );
}

export default UserSignin;
