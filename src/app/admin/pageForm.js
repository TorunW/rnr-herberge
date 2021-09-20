import React, { useEffect, useState, useContext } from 'react';
import $ from 'jquery';
import PostForm from './postForm';
import TranslationForm from './translationForm';
import { Context } from '../context/context-provider';
import '../style/admin.css';

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
  const [updatePageSuccess, setUpdatePageSuccess] = useState(false);
  const [translation, setTranslation] = useState(null);
  console.log(translation, 'translateion');
  const [showDeleteButton, setShowDeleteButton] = useState(false);

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

  setTimeout(() => {
    setUpdatePageSuccess(false);
  }, 3000);

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
      if (props.type !== 'translation') {
        if (res.message) {
          window.location.href =
            '/admin/pages/edit/' +
            (props.formType === 'edit' ? parseInt(pageId) : res.id);
        }
      } else if (props.type === 'translation' && props.formType !== 'edit') {
        props.createTranslation(res.id);
      }
      setUpdatePageSuccess(true);
    });
  }

  function onDelete() {
    $.ajax({
      url: `/db/pages/${props.pageId}`,
      method: 'DELETE',
    }).done(function (res) {
      $.ajax({
        url: `/db/translation/${translation.translation_id}`,
        method: 'DELETE',
      }).done(function (res) {
        $.ajax({
          url: `/db/pages/${translation.eng_id}`,
          method: 'DELETE',
        }).done(function (res) {
          window.location.href = '/admin';
        });
      });
    });
  }

  function onSetTitle(value) {
    setTitle(value);
    setLink(value.replace(/\s+/g, '-').toLowerCase());
  }

  function onSetTranslation(val) {
    setTranslation(val);
  }

  let deleteButtonConfirmationDisplay;
  if (showDeleteButton === true) {
    deleteButtonConfirmationDisplay = (
      <div className="delete-modal">
        <DeleteConfirmation
          close={() =>
            setShowDeleteButton(showDeleteButton === true ? false : true)
          }
          onDelete={onDelete}
        />
        <div
          onClick={() =>
            setShowDeleteButton(showDeleteButton === true ? false : true)
          }
          className="modal-overlay"
        ></div>
      </div>
    );
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
      <TranslationForm
        itemId={pageId}
        itemType="page"
        order={order}
        setTranslation={onSetTranslation}
      />
    );
  }

  let addNewPostButtonDisplay;
  if (props.type !== 'translation' && props.formType === 'edit') {
    addNewPostButtonDisplay = (
      <React.Fragment>
        <hr />
        <a
          className="new-post btn"
          onClick={() =>
            setShowCreatePostForm(showCreatePostForm === false ? true : false)
          }
        >
          Add new post
        </a>
      </React.Fragment>
    );
  }

  let pageSubmitButtonDisplay;
  if (updatePageSuccess === true) {
    pageSubmitButtonDisplay = (
      <a className="update-page btn" onClick={onSubmit}>
        {props.formType === 'edit' ? 'Updated' : 'Page added'}
      </a>
    );
  } else if (updatePageSuccess === false) {
    pageSubmitButtonDisplay = (
      <a className="update-page btn" onClick={onSubmit}>
        {props.formType === 'edit' ? 'Update page' : 'Add page'}
      </a>
    );
  }

  return (
    <React.Fragment>
      <div className="page-form-grid">
        <div
          className={
            props.type === 'translation' ? 'translation-form' : 'original-form'
          }
        >
          <div className="page-input">
            <div>Page title:</div>
            <input
              type="text"
              value={title}
              onChange={e => onSetTitle(e.target.value)}
            />
          </div>
          <div className="page-input">
            <div>Link name:</div>
            <input
              type="text"
              value={link}
              onChange={e => setLink(e.target.value)}
            />
          </div>
          <div className="page-input">
            <div>Page order:</div>
            <input
              type="text"
              value={order}
              onChange={e => setOrder(e.target.value)}
            />
          </div>
          {pageSubmitButtonDisplay}
          {props.formType === 'edit' && props.type !== 'translation' ? (
            <a
              className="delete-page btn"
              onClick={() =>
                setShowDeleteButton(showDeleteButton === true ? false : true)
              }
            >
              Delete page
            </a>
          ) : (
            ''
          )}
          {deleteButtonConfirmationDisplay}
        </div>
        {translationFormDisplay}
      </div>

      {addNewPostButtonDisplay}
      {newPostFormDisplay}
      {postsDisplay}
    </React.Fragment>
  );
}

function DeleteConfirmation(props) {
  function onDelete() {
    props.onDelete();
  }

  return (
    <div
      className="
    modal-window"
    >
      <div className="modal-body">
        <div>Are you sure you want to delete?</div>
      </div>
      <div className="modal-footer">
        <a className="delete btn" onClick={onDelete}>
          Delete
        </a>

        <a className="close-delete-modal btn" onClick={props.close}>
          No
        </a>
      </div>
    </div>
  );
}

export default PageForm;
