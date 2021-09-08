import { useEffect, useState, useContext } from 'react';
import PageForm from './pageForm';
import { Context } from '../context/context-provider';
import '../style/admin.css';

function Admin() {
  const { appState, appDispatch } = useContext(Context);
  const [menuItems, setMenuItems] = useState([]);
  const [sidebarClassName, setSidebarClassName] = useState('hidden');

  // run pages
  useEffect(() => {
    getMenuItems();
  }, []);
  // fetch the pages
  function getMenuItems() {
    fetch(`/db/pages/${appState.language}`)
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res);

        setMenuItems(result);
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
      </div>
    );
  } else {
    sidebarToggleIconDisplay = (
      <div>
        <img src="https://img.icons8.com/ios-filled/32/ffffff/x.png" />
      </div>
    );
  }

  return (
    <main className="admin-page">
      <div className="page-form">
        <main id="admin">{pageFormDisplay}</main>
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

        <a className="btn-add-page" href={`/admin/pages/create`}>
          Add new page
        </a>
      </aside>
    </main>
  );
}
export default Admin;
