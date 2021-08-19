import { useEffect, useState, useContext } from 'react';
import '../style/header.css';
import { Context } from '../context/context-provider';

// the img as home
// the menu
// show menu
// show post
// style
function Header(props) {
  const { appState, appDispatch } = useContext(Context);
  const [menuItems, setMenuItems] = useState();
  const [translatedPage, setTranslatedPage] = useState(null);

  useEffect(() => {
    getPages();
  }, []);

  useEffect(() => {
    if (appState.pageId !== null) {
      getPageTranslation();
    }
  }, [appState.pageId]);

  function getPages() {
    fetch(`/db/pages/`)
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res);
        setMenuItems(result);
      });
  }

  function getPageTranslation() {
    fetch(`/db/getpagetranslation/${appState.pageId}`)
      .then(res => res.text())
      .then(res => {
        const translation = JSON.parse(res)[0];
        getTranslatedPage(translation);
      });
  }

  function getTranslatedPage(translation) {
    fetch(`/db/pagesbyid/${translation.eng_id}`)
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res)[0];
        setTranslatedPage(result);
      });
  }

  function onSetLanguage(language) {
    appDispatch({ type: 'SET_LANGUAGE', val: language });
  }

  let menuItemsDisplay = 'This will be menu items';
  if (menuItems) {
    menuItemsDisplay = menuItems.map((menuItem, index) => (
      <a href={menuItem.link} key={index}>
        {menuItem.title}
      </a>
    ));
  }

  console.log(translatedPage, 'transpage');
  return (
    <div className="header">
      <div className="language-menu">
        <a href={translatedPage ? translatedPage.link : ''}>ENG</a>
        <a>DE</a>
      </div>
      <img src="RnR Logo.png" className="header-img" />
      <div className="menu-items"> {menuItemsDisplay}</div>
    </div>
  );
}
export default Header;
