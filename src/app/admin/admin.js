import { useEffect, useState, useContext, React } from 'react';
import PageForm from './pageForm';
import { Context } from '../context/context-provider';
import '../style/admin.css';
import $ from 'jquery';
import { pages } from '../../db/data-pages';

function Admin(props) {
  const { appState, appDispatch } = useContext(Context);
  const [menuItems, setMenuItems] = useState([]);
  const [sidebarClassName, setSidebarClassName] = useState(
    window.location.pathname === '/admin/' ||
      window.location.pathname === '/admin'
      ? ''
      : 'hidden'
  );
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [user, setUser] = useState(null);

  // run pages
  useEffect(() => {
    getMenuItems();
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  // fetch the pages
  function getMenuItems() {
    setMenuItems(pages.filter(p => p.language === appState.language));
  }

  function getUser() {
    fetch('http://localhost:3000/db/user/')
      .then(res => res.text())
      .then(res => {
        setUser(JSON.parse(res));
      });
  }

  function onLogoutClick() {
    fetch('http://localhost:3000/db/signout/')
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

  let adminInfoTextDisplay;
  if (
    window.location.pathname === '/admin' ||
    window.location.pathname === '/admin/'
  ) {
    adminInfoTextDisplay = (
      <div className="info-text">
        <div className="admin-border">
          <div className="admin-title">Welcome to the admin panel!</div>
          <br />
          <div className="info-box">
            <p className="title">Add a new page:</p>
            <p>
              If you want to add a new page click the button "Add new page"
              located in the menu to the left and an empty form will appear.
            </p>
            <p>
              The first box to appear is for the German version of the website.
              You have to write the name/title of the page, and the link will be
              generated automatically, then add the order to the page to decide
              where in the menu on the home page it should appear. After that
              you can click “Add page”, a second box will then pop up for the
              English version, where the order will already be there, name/title
              you’ll have to fill in, and then click add page again. Next you
              can start adding posts (content) to the page.
            </p>
          </div>
          <div className="info-box">
            <p className="title">Add a new post:</p>
            <p>
              To add a new post click the button “Add new post” to do this on a
              pre-existing page simply choose the page you want to edit in the
              menu to the left. You can then choose the title of the post (this
              can also be left empty), the order of where on the page it should
              be located, and finally what type of content. You can choose
              between “Article” which will give you a text editor to write in,
              “Contact form” for a contact for, “Booking form” for the bookings,
              “Getränke” for the drinks (it will then be in a box with submenus
              for each category of drinks), or “Map” to get the map with RnR
              Herberge’s address pinned.
            </p>
            <p>
              Like when adding a page when you are done simply click add post
              and a box for the english version will appear.
            </p>
          </div>
          <div className="info-box">
            <p className="title">Edit:</p>
            <p>
              To edit any page or post simply click the “update” button after
              doing your changes.
            </p>
            <br />
          </div>
          <div className="info-box">
            <p className="title">Images:</p>
            <p>
              When adding images to any post the size already has to be defined.
              If any image is too big you can use{' '}
              <a href="https://squoosh.app/">https://squoosh.app/</a> to decide
              how many pixels (width and height) you want the image to be. An
              image should preferably not be heavier than 500kB to keep the
              speed of the website and not slow it down, this you can also
              change in the above mentioned website. To resize an image on{' '}
              <a href="https://squoosh.app/">https://squoosh.app/</a>, choose
              the image, the click “resize” a menu will pop up, make sure
              “method” is set to “lanczos3”. After that decide either height or
              width (the one you don't change will change automatically so you
              don't lose the dimensions of the image). Set the file type to
              browser JPEG.
            </p>
            <p>
              After these steps you will already see how many kB the image will
              be, if it’s still too high you can lower the quality. When you are
              done click the download icon, after that upload your image in the
              text editor!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="admin-page">
      <div className="page-form">
        <main id="admin">
          <div>
            <a
              className="password btn"
              onClick={() =>
                setShowChangePasswordForm(
                  showChangePasswordForm === true ? false : true
                )
              }
            >
              New password
            </a>
            <a className="logout btn" onClick={() => onLogoutClick()}>
              Logout
            </a>
          </div>
          {changePasswordFormDisplay}
          {pageFormDisplay}
          {adminInfoTextDisplay}
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
          <div className="admin-menu">
            <div className="admin-menu-items">
              <a href="/admin/" className="admin-info">
                Admin info
              </a>
              {menuItemsDisplay}
            </div>
          </div>
        </div>

        <a className="add-page btn" href={`/admin/pages/create`}>
          Add new page
        </a>
      </aside>
    </main>
  );
}

function ChangePasswordForm(props) {
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
    $.ajax({
      url: `.http://localhost:3000/db/user/${props.user.id}`,
      method: 'POST',
      data: newUserData,
    }).done(function (res) {
      console.log(res, 'result');
    });
  }

  let passwordsErrorDisplay = '';
  if (!isMatch && newPassword !== '' && newPasswordRepeat !== '') {
    passwordsErrorDisplay = (
      <p style={{ color: 'red' }}>Passwords doesn't match</p>
    );
  }

  let updateButtonDisplay;
  if (isMatch === true) {
    updateButtonDisplay = (
      <a
        className="update-password btn"
        onClick={() => onUpdatePasswordClick()}
      >
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
        <a className="close-password-modal btn" onClick={props.close}>
          Close
        </a>
        {updateButtonDisplay}
      </div>
    </div>
  );
}

export default Admin;
