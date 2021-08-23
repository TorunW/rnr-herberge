import { useEffect, useState, useContext } from 'react';
import $ from 'jquery';
import PostForm from './postForm';
import TranslationForm from './translationForm';
import { Context } from '../context/context-provider';

function PageForm(props) {
  let pageId = window.location.pathname.split('/')[4];
  if (props.page) pageId = props.page.page_id;
  else if (props.pageId) pageId = props.pageId;

  const { appState, appDispatch } = useContext(Context);

  const [title, setTitle] = useState(props.page ? props.page.title : '');
  const [link, setLink] = useState(props.page ? props.page.link : '');
  const [order, setOrder] = useState(props.order ? props.order : '');
  const [language, setLanguage] = useState(
    props.type === 'translation' ? 'EN' : 'DE'
  );
  const [posts, setPosts] = useState([]);
  const [showCreatePostForm, setShowCreatePostForm] = useState(false);

  useEffect(() => {
    if (props.formType === 'edit' && props.type !== 'translation') {
      getPage();
      getPosts();
    }
    if (props.type === 'translation') {
      appDispatch({ type: 'SET_TRANSLATEDPAGEID', val: pageId });
    } else {
      appDispatch({ type: 'SET_PAGEID', val: pageId });
    }
  }, []);

  function getPage() {
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
    fetch(`/db/postsbypageid/${pageId}`)
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
      url: `/db/pages/` + (props.formType === 'edit' ? pageId : ''),
      method: props.formType === 'edit' ? 'PUT' : 'POST',
      data: newValues,
    }).done(function (res) {
      console.log(res, 'res, pagename');
      if (props.type !== 'translation') {
        if (res.message) {
          window.location.href =
            '/admin/pages/edit/' +
            (props.formType === 'edit' ? parseInt(pageId) : res.id);
        }
      } else if (props.type === 'translation' && props.formType !== 'edit') {
        props.createTranslation(res.id);
      }
    });
  }

  function onDelete() {
    $.ajax({
      url: `/db/pages/${pageId}`,
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
      <PostForm post={post} onSubmitPostForm={getPosts} pageId={pageId} />
    ));
  }

  let newPostFormDisplay;
  if (showCreatePostForm === true && props.type !== 'translation') {
    newPostFormDisplay = (
      <PostForm onSubmitPostForm={getPosts} pageId={pageId} />
    );
  }

  let translationFormDisplay;
  if (
    props.formType === 'edit' &&
    order !== '' &&
    props.type !== 'translation'
  ) {
    translationFormDisplay = (
      <TranslationForm itemId={pageId} itemType="page" order={order} />
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
