import { useEffect, useState, useContext } from 'react';
import PageForm from './pageForm';
import { Context } from '../context/context-provider';
import '../style/admin.css';

function Admin() {
  const { appState, appDispatch } = useContext(Context);
  const [menuItems, setMenuItems] = useState([]);

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

  return (
    <main className="admin-page">
      <div className="page-form">
        <div className="admin-menu">{menuItemsDisplay}</div>

        <button href={`/admin/pages/create`}>Add new page +</button>
        {pageFormDisplay}
      </div>
    </main>
  );
}
export default Admin;
