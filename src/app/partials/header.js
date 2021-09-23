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
    fetch(
      `/db/getpage${appState.language === 'DE' ? 'translation' : 'origin'}/${
        appState.pageId
      }`
    )
      .then(res => res.text())
      .then(res => {
        const translation = JSON.parse(res)[0];
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

  let menuItemsDisplay;
  if (menuItems) {
    menuItemsDisplay = menuItems.map((menuItem, index) => {
      if (menuItem.title !== 'home') {
        return (
          <div className="menu-item-wrapper">
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
          </div>
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
            <a href={deLinkHref}>
              <svg
                className="flag-icon"
                xmlns="http://www.w3.org/2000/svg"
                id="flag-icon-css-de"
                viewBox="0 0 512 512"
              >
                <path fill="#ffce00" d="M0 341.3h512V512H0z" />
                <path d="M0 0h512v170.7H0z" />
                <path fill="#d00" d="M0 170.7h512v170.6H0z" />
              </svg>
            </a>

            <a href={enLinkHref}>
              {' '}
              <svg
                className="flag-icon"
                xmlns="http://www.w3.org/2000/svg"
                id="flag-icon-css-gb"
                viewBox="0 0 512 512"
              >
                <path fill="#012169" d="M0 0h512v512H0z" />
                <path
                  fill="#FFF"
                  d="M512 0v64L322 256l190 187v69h-67L254 324 68 512H0v-68l186-187L0 74V0h62l192 188L440 0z"
                />
                <path
                  fill="#C8102E"
                  d="M184 324l11 34L42 512H0v-3l184-185zm124-12l54 8 150 147v45L308 312zM512 0L320 196l-4-44L466 0h46zM0 1l193 189-59-8L0 49V1z"
                />
                <path
                  fill="#FFF"
                  d="M176 0v512h160V0H176zM0 176v160h512V176H0z"
                />
                <path
                  fill="#C8102E"
                  d="M0 208v96h512v-96H0zM208 0v512h96V0h-96z"
                />
              </svg>
            </a>
          </div>
          <div className="menu-items"> {menuItemsDisplay}</div>
        </div>
      </div>
    );
  } else {
    headerDisplay = (
      <div className="header">
        <div className="language-menu">
          <a href={deLinkHref}>
            <svg
              className="flag-icon"
              xmlns="http://www.w3.org/2000/svg"
              id="flag-icon-css-de"
              viewBox="0 0 512 512"
            >
              <path fill="#ffce00" d="M0 341.3h512V512H0z" />
              <path d="M0 0h512v170.7H0z" />
              <path fill="#d00" d="M0 170.7h512v170.6H0z" />
            </svg>
          </a>

          <a href={enLinkHref}>
            {' '}
            <svg
              className="flag-icon"
              xmlns="http://www.w3.org/2000/svg"
              id="flag-icon-css-gb"
              viewBox="0 0 512 512"
            >
              <path fill="#012169" d="M0 0h512v512H0z" />
              <path
                fill="#FFF"
                d="M512 0v64L322 256l190 187v69h-67L254 324 68 512H0v-68l186-187L0 74V0h62l192 188L440 0z"
              />
              <path
                fill="#C8102E"
                d="M184 324l11 34L42 512H0v-3l184-185zm124-12l54 8 150 147v45L308 312zM512 0L320 196l-4-44L466 0h46zM0 1l193 189-59-8L0 49V1z"
              />
              <path
                fill="#FFF"
                d="M176 0v512h160V0H176zM0 176v160h512V176H0z"
              />
              <path
                fill="#C8102E"
                d="M0 208v96h512v-96H0zM208 0v512h96V0h-96z"
              />
            </svg>
          </a>
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
