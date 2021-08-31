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
  const [smallScreenMenu, setSmallScreenMenu] = useState(
    window.innerWidth <= 865 ? true : false
  );

  useEffect(() => {
    getPages();
    window.addEventListener('resize', onWindowResize);
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
    console.log(appState);
    fetch(
      `/db/getpage${appState.language === 'DE' ? 'translation' : 'origin'}/${
        appState.pageId
      }`
    )
      .then(res => res.text())
      .then(res => {
        const translation = JSON.parse(res)[0];
        console.log(translation, 'translation');
        getTranslatedPage(translation);
      });
  }

  function getTranslatedPage(translation) {
    fetch(
      `/db/pagesbyid/${
        translation[(appState.language === 'DE' ? 'eng' : 'de') + '_id']
      }`
    )
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res)[0];
        setTranslatedPage(result);
      });
  }

  function onWindowResize() {
    setSmallScreenMenu(window.innerWidth <= 865 ? true : false);
  }

  let menuItemsDisplay = 'This will be menu items';
  if (menuItems) {
    menuItemsDisplay = menuItems.map((menuItem, index) => {
      if (menuItem.title !== 'home') {
        return (
          <a
            href={
              menuItem.link +
              (menuItem.language !== null
                ? '?language=' + menuItem.language
                : '')
            }
            key={index}
          >
            {menuItem.title === 'home' ? '' : menuItem.title}
          </a>
        );
      }
    });
  }

  let urlSuffix =
    translatedPage && translatedPage.language
      ? '?language=' + translatedPage.language
      : '';

  let deLinkHref, enLinkHref;
  if (translatedPage) {
    if (appState.language === 'DE') {
      deLinkHref = window.location.href;
      enLinkHref = translatedPage.link + '?language=EN';
    } else {
      deLinkHref = translatedPage.link + '?language=DE';
      enLinkHref = window.location.href;
    }
  }

  let headerDisplay;
  if (smallScreenMenu === false) {
    headerDisplay = (
      <div className="header">
        <div className="logo">
          <a
            href={
              appState.language === 'DE'
                ? '/home-de?language=DE'
                : '/home?language=EN'
            }
          >
            <img src="RnR Logo.png" className="header-img" />
          </a>
        </div>
        <div className="menu-right-column">
          <div className="language-menu">
            <a href={deLinkHref}>DE</a>
            <a href={enLinkHref}>EN</a>
          </div>
          <div className="menu-items"> {menuItemsDisplay}</div>
        </div>
      </div>
    );
  } else {
    headerDisplay = (
      <div className="header">
        <div className="language-menu">
          <a href={deLinkHref}>DE</a>
          <a href={enLinkHref}>EN</a>
        </div>
        <div className="logo">
          <a
            href={
              appState.language === 'DE'
                ? '/home-de?language=DE'
                : '/home?language=EN'
            }
          >
            <img src="RnR Logo.png" className="header-img" />
          </a>
        </div>
        <div className="menu-right-column">
          <div className="menu-items"> {menuItemsDisplay}</div>
        </div>
      </div>
    );
  }
  return <div>{headerDisplay}</div>;
}
export default Header;
