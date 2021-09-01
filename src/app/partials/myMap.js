import React from 'react';

function MyMap(props) {
  return (
    <div>
      <iframe
        width="520"
        height="400"
        frameborder="0"
        scrolling="no"
        marginheight="0"
        marginwidth="0"
        id="gmap_canvas"
        src="https://maps.google.com/maps?width=520&amp;height=400&amp;hl=en&amp;q=Muskauer%20Str.%2011%20Berlin+(MyMap)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
      ></iframe>
      <script
        type="text/javascript"
        src="https://embedmaps.com/google-maps-authorization/script.js?id=690a3cfab816071a873f0a3bfb01a3a19c9ea0cf"
      ></script>
    </div>
  );
}

export default MyMap;
