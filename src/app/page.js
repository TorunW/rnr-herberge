import { useEffect, useState, useContext } from 'react';
import './style/page.css';
import Post from './partials/post';
import MenuDrinks from './partials/menuDrinks';
import { Context } from './context/context-provider';
import { pages } from '../db/data-pages';
import { postsData } from '../db/data-posts';
import { filter } from 'lodash';

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
    const pagePath = pages.find(item => item.link === props.path);
    setPage(pagePath);
  }

  function getPosts() {
    const postById = postsData.filter(item => item.page_id === page.page_id);
    const filteredArray = postById.filter(post => post.type === 'drinks');
    setDrinksMenu(filteredArray);
    setPosts(postById);
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
