import { useEffect, useState } from 'react';
import $ from 'jquery';
import BookingForm from './bookingForm';
import MessageForm from './messageForm';
import TextEditor from '../partials/textEditor';

function PostForm(props) {
  const [title, setTitle] = useState(props.post ? props.post.title : '');
  const [order, setOrder] = useState(props.post ? props.post.ord : '');
  const [type, setType] = useState(props.post ? props.post.type : '');
  const [content, setContent] = useState(props.post ? props.post.content : '');

  function onSubmit() {
    const newPostValues = {
      page_id: props.pageId,
      title,
      content,
      ord: order,
      type,
    };

    let ajaxUrl = `/db/posts/` + (props.post ? props.post.post_id : '');
    let ajaxMethod = props.post ? 'PUT' : 'POST';

    $.ajax({
      url: ajaxUrl,
      method: ajaxMethod,
      data: newPostValues,
    }).done(function (res) {
      console.log(res, 'res');
      window.location.href = `/admin/pages/edit/${props.pageId}`;
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
  }

  return (
    <div>
      <hr />
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
      </select>
      {typeDisplay}
      <button onClick={onSubmit}>Submit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}

export default PostForm;
