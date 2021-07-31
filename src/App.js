import './App.css';
import { useEffect, useState } from 'react';
import Page from './app/page.js';
import Header from './app/header';
import Footer from './app/footer';
import Admin from './app/admin/admin';

function App() {
  const path = window.location.pathname.split('/')[1];

  let templateDisplay = (
    <main>
      <div>Hello I'm App</div>
      <Page />
      <Header />
      <Footer />
    </main>
  );

  if (path === 'admin') {
    templateDisplay = <Admin />;
  }
  return <div className="App">{templateDisplay}</div>;
}

export default App;
