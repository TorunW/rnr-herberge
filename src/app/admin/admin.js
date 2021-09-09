import { useEffect, useState, useContext, React } from 'react';
import PageForm from './pageForm';
import { Context } from '../context/context-provider';
import '../style/admin.css';
import $ from 'jquery';

function Admin(props) {
  const { appState, appDispatch } = useContext(Context);
  const [menuItems, setMenuItems] = useState([]);
  const [sidebarClassName, setSidebarClassName] = useState(
    window.location.pathname === '/admin/' ? '' : 'hidden'
  );
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [user, setUser] = useState(null);
  console.log(user, 'user');

  // run pages
  useEffect(() => {
    getMenuItems();
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  function getUser() {
    fetch('/db/user/')
      .then(res => res.text())
      .then(res => {
        console.log(JSON.parse(res));
        setUser(JSON.parse(res));
      });
  }
  // fetch the pages
  function getMenuItems() {
    fetch(`/db/pages/${appState.language}`)
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res);
        setMenuItems(result);
      });
  }

  function onLogoutClick() {
    fetch('/db/signout/')
      .then(res => res.text())
      .then(res => {
        window.location.href = '/';
      });
  }

  const menuItemsDisplay = menuItems.map((menuItem, index) => (
    <a href={`/admin/pages/edit/${menuItem.page_id}`}>{menuItem.title}</a>
  ));

  const pageType = window.location.pathname.split('/')[2];
  const formType = window.location.pathname.split('/')[3];
  const pageId = window.location.pathname.split('/')[4];

  let pageFormDisplay;
  if (pageType === 'pages') {
    pageFormDisplay = <PageForm formType={formType} pageId={pageId} />;
  }

  let sidebarToggleIconDisplay;
  if (sidebarClassName === 'hidden') {
    sidebarToggleIconDisplay = (
      <div className="sidebar-icon">
        <img src="https://img.icons8.com/material-outlined/38/ffffff/menu--v1.png" />
        <div>MENU</div>
      </div>
    );
  } else {
    sidebarToggleIconDisplay = (
      <div className="sidebar-icon">
        <img src="https://img.icons8.com/ios-filled/32/ffffff/x.png" />
        <div>MENU</div>
      </div>
    );
  }

  let changePasswordFormDisplay;
  if (showChangePasswordForm === true) {
    changePasswordFormDisplay = (
      <div className="change-password-modal">
        <ChangePasswordForm
          user={user}
          close={() =>
            setShowChangePasswordForm(
              showChangePasswordForm === true ? false : true
            )
          }
        />
        <div
          onClick={() =>
            setShowChangePasswordForm(
              showChangePasswordForm === true ? false : true
            )
          }
          className="modal-overlay"
        ></div>
      </div>
    );
  }

  return (
    <main className="admin-page">
      <div className="page-form">
        <main id="admin">
          <div>
            <a
              className="password"
              onClick={() =>
                setShowChangePasswordForm(
                  showChangePasswordForm === true ? false : true
                )
              }
            >
              New password
            </a>
            <a className="logout" onClick={() => onLogoutClick()}>
              Logout
            </a>
          </div>
          {changePasswordFormDisplay}
          {pageFormDisplay}
        </main>
      </div>
      <aside id="sidebar" className={sidebarClassName}>
        <a
          className="sidebar-toggle"
          onClick={() =>
            sidebarClassName === ''
              ? setSidebarClassName('hidden')
              : setSidebarClassName('')
          }
        >
          {sidebarToggleIconDisplay}
        </a>
        <div className="sidebar-items">
          <div className="admin-menu">{menuItemsDisplay}</div>
        </div>

        <a className="btn add-page" href={`/admin/pages/create`}>
          Add new page
        </a>
      </aside>
    </main>
  );
}

function ChangePasswordForm(props) {
  console.log(props);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    let newIsMatch = false;
    if (newPassword !== '' && newPassword === newPasswordRepeat)
      newIsMatch = true;
    setIsMatch(newIsMatch);
  }, [newPassword, newPasswordRepeat]);

  function onUpdatePasswordClick() {
    const newUserData = {
      ...props.user,
      password: newPassword,
    };
    console.log('on update password click');
    $.ajax({
      url: `/db/user/${props.user.id}`,
      method: 'POST',
      data: newUserData,
    }).done(function (res) {
      console.log(res, 'result');
    });
  }

  let passwordsErrorDisplay = '';
  if (!isMatch && newPassword !== '' && newPasswordRepeat !== '') {
    passwordsErrorDisplay = (
      <p style={{ color: 'red' }}>Passwörter sind nicht gleich</p>
    );
  }

  let updateButtonDisplay;
  if (isMatch === true) {
    updateButtonDisplay = (
      <a className="update-btn" onClick={() => onUpdatePasswordClick()}>
        Update password
      </a>
    );
  }

  return (
    <div className="modal-window">
      <div className="modal-header">
        <div>Change password</div>
      </div>
      <div className="modal-body">
        <div className="password-input">
          <label> New password: </label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>
        <div className="password-input">
          <label> Repeat password: </label>
          <input
            type="password"
            value={newPasswordRepeat}
            onChange={e => setNewPasswordRepeat(e.target.value)}
          />
        </div>
        {passwordsErrorDisplay}
      </div>
      <div className="modal-footer">
        <a className="close-btn" onClick={props.close}>
          Close
        </a>
        {updateButtonDisplay}
      </div>
    </div>
  );
}

export default Admin;
