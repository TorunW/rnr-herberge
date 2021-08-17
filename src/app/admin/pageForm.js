import { useEffect, useState } from 'react';
import $ from 'jquery';
import PostForm from './postForm';
import TranslationForm from './translationForm';

function PageForm(props) {
  const [title, setTitle] = useState(props.page ? props.page.title : '');
  const [link, setLink] = useState(props.page ? props.page.link : '');
  const [order, setOrder] = useState(props.order ? props.order : '');
  const [language, setLanguage] = useState(
    props.type === 'translation' ? 'eng' : 'de'
  );
  const [posts, setPosts] = useState([]);
  const [showCreatePostForm, setShowCreatePostForm] = useState(false);

  useEffect(() => {
    if (props.formType === 'edit' && props.type !== 'translation') {
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
        setLanguage(page.language);
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
      language,
    };

    $.ajax({
      url: `/db/pages/` + (props.formType === 'edit' ? props.pageId : ''),
      method: props.formType === 'edit' ? 'PUT' : 'POST',
      data: newValues,
    }).done(function (res) {
      console.log(res, 'res');
      if (props.type !== 'translation') {
        if (res.message) {
          window.location.href =
            '/admin/pages/edit/' +
            (props.formType === 'edit' ? parseInt(props.pageId) : res.id);
        }
      } else {
        props.createTranslation(res.id);
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

  let postsDisplay;
  if (props.type !== 'translation') {
    postsDisplay = posts.map((post, index) => (
      <PostForm post={post} onSubmitPostForm={getPosts} pageId={props.pageId} />
    ));
  }

  let newPostFormDisplay;
  if (showCreatePostForm === true && props.type !== 'translation') {
    newPostFormDisplay = (
      <PostForm onSubmitPostForm={getPosts} pageId={props.pageId} />
    );
  }

  let translationFormDisplay;
  if (
    props.formType === 'edit' &&
    order !== '' &&
    props.type !== 'translation'
  ) {
    translationFormDisplay = (
      <TranslationForm itemId={props.pageId} itemType="page" order={order} />
    );
  }

  let addNewPostButtonDisplay;
  if (props.type !== 'translation') {
    addNewPostButtonDisplay = (
      <button
        onClick={() =>
          setShowCreatePostForm(showCreatePostForm === false ? true : false)
        }
      >
        Add new post +
      </button>
    );
  }

  return (
    <main id="admin">
      <div>Pages</div>
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
      {translationFormDisplay}
      {addNewPostButtonDisplay}
      {newPostFormDisplay}
      {postsDisplay}
    </main>
  );
}
export default PageForm;
