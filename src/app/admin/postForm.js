import { useEffect, useState } from 'react';
import $ from 'jquery';

function PostForm(props) {
  const [title, setTitle] = useState(props.post ? props.post.title : '');
  const [content, setContent] = useState(props.post ? props.post.content : '');
  const [order, setOrder] = useState(props.post ? props.post.ord : '');
  const [type, setType] = useState(props.post ? props.post.type : '');

  function onSubmit() {
    const newPostValues = {
      page_id: props.pageId,
      title,
      content,
      ord: order,
      type,
    };

    console.log(newPostValues);
    let ajaxUrl = `/db/posts/` + (props.post ? props.post.post_id : '');
    console.log(ajaxUrl);
    let ajaxMethod = props.post ? 'PUT' : 'POST';
    console.log(ajaxMethod);

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

  return (
    <div>
      <hr />
      <div>Title</div>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <div>Content</div>
      <input
        type="text"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <div>Order</div>
      <input
        type="text"
        value={order}
        onChange={e => setOrder(e.target.value)}
      />
      <div>Type</div>
      <input type="text" value={type} onChange={e => setType(e.target.value)} />
      <button onClick={onSubmit}>Submit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}

export default PostForm;
