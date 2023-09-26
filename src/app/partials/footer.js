import { useEffect } from 'react';
import '../style/footer.css';

function Footer() {
  useEffect(() => {
    checkForHashtags();
  }, []);

  function checkForHashtags() {
    setTimeout(() => {
      if (window.location.href.indexOf('#') > -1) {
        var urlHashtag = window.location.href.split('#')[1];
        if (urlHashtag !== null) {
          if (document.getElementById(urlHashtag) !== null)
            document.getElementById(urlHashtag).scrollIntoView();
          else checkForHashtags();
        }
      }
    }, 100);
  }

  return (
    <div className="Footer">
      <a
        className="footer-icon"
        href="https://www.facebook.com/RockNRollHerberge"
      >
        <img src="https://img.icons8.com/color/50/000000/facebook.png" />
      </a>
      <a className="abg-footer" href="/kontakt?language=DE#post-75">
        ABG & Impressum
      </a>
    </div>
  );
}
export default Footer;
