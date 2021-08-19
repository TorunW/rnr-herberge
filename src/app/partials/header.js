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
    fetch(`/db/pages/${appState.language}`)
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

  console.log(translatedPage, 'transpagenw');

  function getTranslatedPage(translation) {
    fetch(`/db/pagesbyid/${translation.eng_id}`)
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res)[0];
        setTranslatedPage(result);
      });
  }

  let menuItemsDisplay = 'This will be menu items';
  if (menuItems) {
    menuItemsDisplay = menuItems.map((menuItem, index) => (
      <a
        href={
          menuItem.link +
          (menuItem.language !== null ? '?language=' + menuItem.language : '')
        }
        key={index}
      >
        {menuItem.title}
      </a>
    ));
  }

  let urlSuffix =
    translatedPage && translatedPage.language
      ? '?language=' + translatedPage.link
      : '';

  return (
    <div className="header">
      <div className="language-menu">
        <a href={translatedPage ? translatedPage.link + urlSuffix : ''}>
          {appState.language === 'de' ? 'eng' : 'de'}
        </a>
        <a href={window.location.href}>
          {appState.language === 'de' ? 'de' : 'eng'}
        </a>
      </div>
      <img src="RnR Logo.png" className="header-img" />
      <div className="menu-items"> {menuItemsDisplay}</div>
    </div>
  );
}
export default Header;
