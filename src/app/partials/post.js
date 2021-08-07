import React, { useEffect, useState } from 'react';
import Bookings from './bookings';
import Messages from './messages';
import MyMap from './myMap';

function Post(props) {
  const post = props.post;

  let postTypeDisplay;
  if (post.type === 'map') {
    postTypeDisplay = (
      <div>
        <div className="title">{post.title}</div>
        <MyMap />
      </div>
    );
  } else if (post.type === 'article') {
    postTypeDisplay = (
      <div>
        <div className="title">{post.title}</div>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
      </div>
    );
  } else if (post.type === 'booking') {
    postTypeDisplay = (
      <React.Fragment>
        <div className="title">{post.title}</div>
        <Bookings />
      </React.Fragment>
    );
  } else if (post.type === 'message') {
    postTypeDisplay = (
      <React.Fragment>
        <div className="title">{post.title}</div>
        <Messages />
      </React.Fragment>
    );
  }
  return <div className="post">{postTypeDisplay}</div>;
}
export default Post;
