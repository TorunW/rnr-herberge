import { useEffect, useState } from 'react';

// the img as home
// the menu
// show menu
// show post
// style
function Header(props) {
  const [menuItems, setMenuItems] = useState();

  useEffect(() => {
    getPage();
  }, []);

  function getPage() {
    fetch(`/db/pages/`)
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res);
        setMenuItems(result);
      });
  }

  let menuItemsDisplay = 'This will be menu items';
  if (menuItems) {
    menuItemsDisplay = menuItems.map((menuItem, index) => (
      <a href={menuItem.link} key={index}>
        {menuItem.title}
      </a>
    ));
  }

  return <div className="Header">{menuItemsDisplay}</div>;
}
export default Header;
