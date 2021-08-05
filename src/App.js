import './App.css';
import { useEffect, useState } from 'react';
import Page from './app/page.js';
import Header from '../src/app/partials/header';
import Footer from './app/partials/footer';
import Admin from './app/admin/admin';

function App() {
  const path = window.location.pathname.split('/')[1];

  let templateDisplay = (
    <main>
      <Header />
      <Page path={path === '' ? 'home' : path} />

      <Footer />
    </main>
  );

  if (path === 'admin') {
    templateDisplay = <Admin />;
  }

  return <div className="App">{templateDisplay}</div>;
}

export default App;
