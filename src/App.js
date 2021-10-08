import './App.css';
import AppContextProvider from './app/context/context-provider';
import Page from './app/page.js';
import Header from '../src/app/partials/header';
import Footer from './app/partials/footer';
import Admin from './app/admin/admin';
import './app/style/page.css';
import UserSignin from './app/partials/singin';
import { useEffect, useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, 1000);
  }, []);

  console.log(loading);

  const path = window.location.pathname.split('/')[1];
  let templateDisplay = (
    <main>
      <Header />
      <Page path={path === '' ? 'home-de' : path} />
      <Footer />
    </main>
  );

  if (path === 'admin') {
    templateDisplay = <Admin />;
  }
  if (path === 'signin') {
    templateDisplay = <UserSignin />;
  }

  return (
    <div className={'App' + (loading === false ? ' loading' : '')}>
      <div className="image-hero-area"></div>
      {templateDisplay}
    </div>
  );
}

function AppWrapper() {
  return (
    <AppContextProvider>
      <App />
    </AppContextProvider>
  );
}

export default AppWrapper;
