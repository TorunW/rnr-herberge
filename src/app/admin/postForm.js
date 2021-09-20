import { useState, useContext, useEffect } from 'react';
import $ from 'jquery';
import BookingForm from './bookingForm';
import MessageForm from './messageForm';
import TextEditor from '../partials/textEditor';
import TranslationForm from './translationForm';
import { Context } from '../context/context-provider';
import '../style/admin.css';

function PostForm(props) {
  const { appState, appDispatch } = useContext(Context);
  const [title, setTitle] = useState(props.post ? props.post.title : '');
  const [order, setOrder] = useState(
    props.post ? props.post.ord : props.order ? props.order : ''
  );
  const [type, setType] = useState(
    props.post ? props.post.type : props.postType ? props.postType : ''
  );
  const [content, setContent] = useState(props.post ? props.post.content : '');
  const [language, setLanguage] = useState(
    props.type === 'translation' ? 'EN' : 'DE'
  );
  const isEditPostMode = props.post ? true : false;
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [translation, setTranslation] = useState(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  setTimeout(() => {
    setUpdateSuccess(false);
  }, 3000);

  function onSubmit() {
    const newPostValues = {
      page_id:
        props.type === 'translation'
          ? appState.translatedPageId
          : appState.pageId,
      title,
      content,
      ord: order,
      type,
      language,
    };

    let ajaxUrl = `/db/posts/` + (props.post ? props.post.post_id : '');
    let ajaxMethod = props.post ? 'PUT' : 'POST';

    $.ajax({
      url: ajaxUrl,
      method: ajaxMethod,
      data: newPostValues,
    }).done(function (res) {
      console.log(res, 'res');
      setUpdateSuccess(true);
      if (props.type === 'translation' && isEditPostMode === false) {
        props.createTranslation(res.id);
      } else {
        if (isEditPostMode === false) {
          window.location.href = `/admin/pages/edit/${props.pageId}`;
        }
      }
    });
  }

  function onDelete() {
    console.log(props.postId);
    console.log(props.post);
    $.ajax({
      url: `/db/posts/${props.post.post_id}`,
      method: 'DELETE',
    }).done(function (res) {
      $.ajax({
        url: `/db/translation/${translation.translation_id}`,
        method: 'DELETE',
      }).done(function (res) {
        $.ajax({
          url: `/db/posts/${translation.eng_id}`,
          method: 'DELETE',
        }).done(function (res) {
          window.location.href = `/admin/pages/edit/${props.pageId}`;
        });
      });
    });
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

  let typeDisplay;
  if (type === 'article') {
    typeDisplay = <TextEditor val={content} onTextEditorUpdate={setContent} />;
  } else if (type === 'booking') {
    typeDisplay = <BookingForm />;
  } else if (type === 'message') {
    typeDisplay = <MessageForm />;
  } else if (type === 'map') {
    typeDisplay = <div>This will be a map</div>;
  } else if (type === 'drinks') {
    typeDisplay = <TextEditor val={content} onTextEditorUpdate={setContent} />;
  }

  let displayTranslationForm;
  if (isEditPostMode === true && props.type !== 'translation') {
    displayTranslationForm = (
      <TranslationForm
        pageId={props.pageId}
        itemId={props.post.post_id}
        itemType="post"
        order={order}
        postType={type}
        setTranslation={onSetTranslation}
      />
    );
  }

  let submitButtonDisplay;
  if (updateSuccess === false) {
    submitButtonDisplay = (
      <a onClick={onSubmit} className="update-post btn">
        {isEditPostMode === true ? 'Update post' : 'Add post'}
      </a>
    );
  } else if (updateSuccess === true) {
    submitButtonDisplay = (
      <a onClick={onSubmit} className="update-post btn">
        {isEditPostMode === true ? 'Updated' : 'Post added'}
      </a>
    );
  }
  <a
    onClick={onSubmit}
    className={'update-post btn' + updateSuccess === true ? ' updated' : ''}
  >
    {isEditPostMode === true ? 'Update post' : 'Add post'}
  </a>;

  return (
    <div className="form">
      <div className="post-form">
        <div
          className={
            props.type === 'translation'
              ? 'translaion-post-form'
              : 'original-language-post-form'
          }
        >
          <div className="post-form-input">
            <div>Title</div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="post-form-input">
            <div>Order</div>
            <input
              type="text"
              value={order}
              onChange={e => setOrder(e.target.value)}
            />
          </div>
          <div className="post-form-input">
            <div>Type</div>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="">Choose type</option>
              <option value="article">Article</option>
              <option value="booking">Booking form</option>
              <option value="message">Contact form</option>
              <option value="map">Map</option>
              <option value="drinks">Getränke</option>
            </select>
          </div>
          {typeDisplay}
          {submitButtonDisplay}
          {props.type !== 'translation' ? (
            <a
              className="delete-post btn"
              onClick={() =>
                setShowDeleteButton(showDeleteButton === true ? false : true)
              }
            >
              Delete
            </a>
          ) : (
            ''
          )}
          {deleteButtonConfirmationDisplay}
        </div>
      </div>
      {displayTranslationForm}
    </div>
  );
}

function DeleteConfirmation(props) {
  function onDelete() {
    props.onDelete();
  }

  return (
    <div className="modal-window">
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

export default PostForm;
