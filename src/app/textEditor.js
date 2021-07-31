import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../.././src/app/style/text-editor.css';
import axios from 'axios';

function TextEditor(props) {
  const [showHtml, setShowHtml] = useState(false);
  let initText = props.val ? props.val : '';
  const [convertedText, setConvertedText] = useState(initText);
  const [file, setFile] = useState();
  const [fileData, setFileData] = useState();

  const reader = new FileReader();

  reader.addEventListener(
    'load',
    function () {
      // convert image file to base64 string
      setFileData(reader.result);
    },
    false
  );

  let quillObj = useRef();

  useEffect(() => {
    props.onTextEditorUpdate(convertedText);
  }, [convertedText]);

  async function imageHandler() {
    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      var file: any = input.files[0];
      reader.readAsDataURL(file);
      setFile(file);
      // const res = await uploadFiles(file, fileName, quillObj);
    };
  }

  const uploadFile = () => {
    const formData = new FormData();
    formData.append('file', file); // appending file
    axios
      .post('/upload', formData)
      .then(res => {
        const range = quillObj.getEditorSelection();
        quillObj.getEditor().insertEmbed(range.index, 'image', res.data.path);
        // props.onFinishUpload(res.data);
      })
      .catch(err => console.log(err));
  };

  const modules = {
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
    },
    clipboard: {
      matchVisual: false,
    },
  };

  let textareDisplay;
  if (showHtml === false) {
    textareDisplay = (
      <ReactQuill
        ref={el => {
          quillObj = el;
        }}
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
