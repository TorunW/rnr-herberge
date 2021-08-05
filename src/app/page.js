import { useEffect, useState } from 'react';
import './style/page.css';
import Post from './partials/post';

function Page(props) {
  const [page, setPage] = useState();
  const [posts, setPosts] = useState();

  console.log(posts, 'post');

  useEffect(() => {
    getPage();
  }, []);

  useEffect(() => {
    if (page) {
      console.log(page, 'page');
      getPosts();
    }
  }, [page]);

  function getPage() {
    fetch(`/db/pages/${props.path}`)
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res)[0];
        setPage(result);
      });
  }

  function getPosts() {
    console.log(page, 'page id');
    fetch(`/db/postsbypageid/${page.page_id}`)
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res);
        setPosts(result);
        console.log(result);
      });
  }

  // let pageStyle = {};
  // if (page && page.background_image) {
  //   let screenRatio = 1.777777777778;
  //   let bgPosY =
  //     window.innerHeight * screenRatio < window.innerWidth &&
  //     page.background_image_bottom
  //       ? '-' + page.background_image_bottom + 'px'
  //       : 'top';
  //   let bgPosX =
  //     window.innerHeight * screenRatio > window.innerWidth &&
  //     page.background_image_left
  //       ? page.background_image_left
  //       : 'center';
  //   pageStyle = {
  //     backgroundImage: `url('${page.background_image}')`,
  //     backgroundPositionY: bgPosY,
  //     backgroundPositionX: bgPosX,
  //   };
  // }

  let postDisplay = 'This will be a post';
  if (posts) {
    postDisplay = posts.map((post, index) => (
      <Post key={index} post={post}>
        <div className="title">{post.title}</div>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
        <hr />
      </Post>
    ));
  }

  return (
    <div className="Page">
      <img
        src="13221228_781278418639710_4856265870553151313_o.jpg"
        className="background-img"
      />

      <div className="post-container"> {postDisplay}</div>
    </div>
  );
}
export default Page;
