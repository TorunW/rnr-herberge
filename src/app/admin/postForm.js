import { useState, useContext } from 'react';
import $ from 'jquery';
import BookingForm from './bookingForm';
import MessageForm from './messageForm';
import TextEditor from '../partials/textEditor';
import TranslationForm from './translationForm';
import { Context } from '../context/context-provider';

function PostForm(props) {
  const { appState, appDispatch } = useContext(Context);
  console.log(appState.translatedPageId, 'transpageid');
  const [title, setTitle] = useState(props.post ? props.post.title : '');
  const [order, setOrder] = useState(
    props.post ? props.post.ord : props.order ? props.order : ''
  );
  const [type, setType] = useState(
    props.post ? props.post.type : props.postType ? props.postType : ''
  );
  const [content, setContent] = useState(props.post ? props.post.content : '');
  const [language, setLanguage] = useState(
    props.type === 'translation' ? 'eng' : 'de'
  );
  const isEditPostMode = props.post ? true : false;

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
      if (props.type === 'translation' && isEditPostMode === false) {
        props.createTranslation(res.id);
      }
    });
  }

  function onDelete() {
    $.ajax({
      url: `/db/posts/${props.post.post_id}`,
      method: 'DELETE',
    }).done(function (res) {
      window.location.href = `/admin/pages/edit/${props.pageId}`;
    });
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
      />
    );
  }

  return (
    <div className="post-form">
      <div className="original-language">
        <div>Title</div>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <div>Order</div>
        <input
          type="text"
          value={order}
          onChange={e => setOrder(e.target.value)}
        />
        <div>Type</div>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="">Choose type</option>
          <option value="article">Article</option>
          <option value="booking">Booking form</option>
          <option value="message">Contact form</option>
          <option value="map">Map</option>
          <option value="drinks">Getränke</option>
        </select>
        {typeDisplay}
        <button onClick={onSubmit}>Submit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
      {displayTranslationForm}
    </div>
  );
}

export default PostForm;
