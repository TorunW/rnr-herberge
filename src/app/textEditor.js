import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style/text-editor.css';
import axios from 'axios';

function TextEditor(props) {
  const [showHtml, setShowHtml] = useState(false);
  const [convertedText, setConvertedText] = useState(
    props.val ? props.val : ''
  );
  const [file, setFile] = useState();
  const [fileData, setFileData] = useState();

  // updates parent component on value change

  useEffect(() => {
    props.onTextEditorUpdate(convertedText);
  }, [convertedText]);

  // reference to the editor object

  let quillObj = useRef();
  /* Image Upload Handlers */

  const reader = new FileReader();
  reader.addEventListener(
    'load',
    function () {
      // convert image file to base64 string
      console.log(reader.result);
      setFileData(reader.result);
    },
    false
  );

  async function imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      var file: any = input.files[0];
      reader.readAsDataURL(file);
      setFile(file);
      const res = await uploadFile(file, file.name, quillObj.current);
    };
  }

  const uploadFile = (file, fileName, quillObj) => {
    const formData = new FormData();
    console.log(file);
    formData.append('file', file); // appending file
    console.log(formData);
    axios
      .post('/upload', formData)
      .then(res => {
        const range = quillObj.getEditorSelection();
        quillObj
          .getEditor()
          .insertEmbed(range.index, 'image', '/' + res.data.path);
      })
      .catch(err => console.log(err));
  };

  /* Editor Config */

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
          ],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  /* Editor Display */

  let textareDisplay;
  if (showHtml === false) {
    textareDisplay = (
      <ReactQuill
        ref={quillObj}
        theme="snow"
        value={convertedText}
        onChange={setConvertedText}
        style={{ minHeight: '300px' }}
        modules={modules}
      />
    );
  } else {
    textareDisplay = (
      <textarea
        value={props.val}
        onChange={e => setConvertedText(e.target.value)}
      ></textarea>
    );
  }

  return <div>{textareDisplay}</div>;
}

export default TextEditor;
