import { useEffect, useState, useContext } from 'react';
import './style/page.css';
import Post from './partials/post';
import MenuDrinks from './partials/menuDrinks';
import { Context } from './context/context-provider';

function Page(props) {
  const { appState, appDispatch } = useContext(Context);

  const [page, setPage] = useState();
  const [posts, setPosts] = useState();
  const [drinksMenu, setDrinksMenu] = useState([]);

  useEffect(() => {
    getPage();
  }, []);

  useEffect(() => {
    if (page) {
      appDispatch({ type: 'SET_PAGEID', val: page.page_id });
      getPosts();
    }
  }, [page]);

  function getPage() {
    fetch(`/db/page/${props.path}`)
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res)[0];
        setPage(result);
      });
  }

  function getPosts() {
    fetch(`/db/postsbypageid/${page.page_id}`)
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res);
        const filteredArray = result.filter(post => post.type === 'drinks');
        setDrinksMenu(filteredArray);
        setPosts(result);
      });
  }

  let hasDrinksMenu = false;

  let postDisplay;
  if (posts) {
    postDisplay = posts.map((post, index) => {
      if (post.type === 'drinks' && hasDrinksMenu === false) {
        hasDrinksMenu = true;
        return (
          <MenuDrinks
            drinksMenu={drinksMenu}
            dangerouslySetInnerHTML={{ __html: drinksMenu }}
          />
        );
      } else {
        return (
          <Post key={index} post={post}>
            <div className="title">{post.title}</div>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>
            <hr />
          </Post>
        );
      }
    });
  }

  return (
    <div className="Page">
      <div className="post-container">
        <div className="post-display">{postDisplay}</div>
      </div>
    </div>
  );
}
export default Page;
