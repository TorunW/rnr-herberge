import { useEffect, useState } from 'react';

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

  let postDisplay = 'This will be a post';
  if (posts) {
    postDisplay = posts.map((post, index) => (
      <div key={index}>
        <div>{post.title}</div>
        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
        <hr />
      </div>
    ));
  }

  return <div className="Page">{postDisplay}</div>;
}
export default Page;
