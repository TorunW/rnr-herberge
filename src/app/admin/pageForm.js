import { useEffect, useState } from 'react';
import $ from 'jquery';
import PostForm from './postForm';

function PageForm(props) {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [order, setOrder] = useState('');
  const [posts, setPosts] = useState([]);
  const [showCreatePostForm, setShowCreatePostForm] = useState(false);

  useEffect(() => {
    if (props.formType === 'edit') {
      getPage();
      getPosts();
    }
  }, []);

  function getPage() {
    const pageId = window.location.pathname.split('/')[4];

    fetch(`/db/pagesbyid/${pageId}`)
      .then(res => res.text())
      .then(res => {
        const page = JSON.parse(res)[0];
        setTitle(page.title);
        setLink(page.link);
        setOrder(page.ord);
      });
  }

  function getPosts() {
    fetch(`/db/postsbypageid/${props.pageId}`)
      .then(res => res.text())
      .then(res => {
        setPosts(JSON.parse(res));
      });
  }

  function onSubmit() {
    const newValues = {
      title,
      link,
      ord: order,
    };

    $.ajax({
      url: `/db/pages/` + (props.formType === 'edit' ? props.pageId : ''),
      method: props.formType === 'edit' ? 'PUT' : 'POST',
      data: newValues,
    }).done(function (res) {
      console.log(res, 'res');
      if (res.message) {
        window.location.href =
          '/admin/pages/edit/' +
          (props.formType === 'edit' ? parseInt(props.pageId) : res.id);
      }
    });
  }

  function onDelete() {
    $.ajax({
      url: `/db/pages/${props.pageId}`,
      method: 'DELETE',
    }).done(function (res) {
      window.location.href = '/admin/';
    });
  }

  let deleteButtonDisplay;
  if (props.formType === 'edit') {
    deleteButtonDisplay = <button onClick={onDelete}>Delete</button>;
  }

  const postsDisplay = posts.map((post, index) => (
    <PostForm post={post} onSubmitPostForm={getPosts} pageId={props.pageId} />
  ));

  let newPostFormDisplay;
  if (showCreatePostForm === true) {
    newPostFormDisplay = (
      <PostForm onSubmitPostForm={getPosts} pageId={props.pageId} />
    );
  }

  return (
    <main id="admin">
      <div>Hello I'm Page form</div>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input type="text" value={link} onChange={e => setLink(e.target.value)} />
      <input
        type="text"
        value={order}
        onChange={e => setOrder(e.target.value)}
      />
      <button onClick={onSubmit}>Submit</button>
      {deleteButtonDisplay}
      <hr />
      <button
        onClick={() =>
          setShowCreatePostForm(showCreatePostForm === false ? true : false)
        }
      >
        Add new post +
      </button>
      {newPostFormDisplay}
      {postsDisplay}
    </main>
  );
}
export default PageForm;
