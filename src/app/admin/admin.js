import { useEffect, useState } from 'react';
import PageForm from './pageForm';

function Admin() {
  const [menuItems, setMenuItems] = useState([]);
  // run pages
  useEffect(() => {
    getMenuItems();
  }, []);
  // fetch the pages
  function getMenuItems() {
    fetch(`/db/pages/`)
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
  console.log(pageId, 'id');

  let pageFormDisplay;
  if (pageType === 'pages') {
    pageFormDisplay = <PageForm formType={formType} pageId={pageId} />;
  }

  return (
    <main>
      <div>Hello I'm admin</div>
      {menuItemsDisplay}
      <a href={`/admin/pages/create`}>Add new +</a>
      {pageFormDisplay}
    </main>
  );
}
export default Admin;
