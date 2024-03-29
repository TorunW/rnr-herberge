import { useEffect, useState } from 'react';
import PageForm from './pageForm';
import $ from 'jquery';
import PostForm from './postForm';
import '../style/admin.css';

function TranslationForm(props) {
  const [loading, setLoading] = useState(true);
  const [translatedItem, setTranslatedItem] = useState(null);
  // get translation based on item type and item id, for that we need a route
  useEffect(() => {
    getTranslation();
  }, []);

  function getTranslation() {
    const ajaxUrl = `http://localhost:3000/db/get${props.itemType}translation/${props.itemId}`;
    fetch(ajaxUrl)
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res)[0];
        // if we get a result, we get the translated item, otherwise we set loading to false
        if (result) {
          // get translated item
          getTranslatedItem(result.eng_id);
          if (props.setTranslation) {
            props.setTranslation(result);
          }
        } else {
          setLoading(false);
        }
      });
  }

  function getTranslatedItem(engId) {
    // we need to get a single item (page or post) by its id
    fetch(`http://localhost:3000/db/${props.itemType}sbyid/${engId}`)
      .then(res => res.text())
      .then(res => {
        const result = JSON.parse(res)[0];
        setTranslatedItem(result);
        setLoading(false);
      });
  }

  function createTranslation(eng_id) {
    let newTranslationValue = {
      de_id: props.itemId,
      eng_id,
      item_type: props.itemType,
    };

    $.ajax({
      url: `http://localhost:3000/db/translation`,
      method: 'POST',
      data: newTranslationValue,
    }).done(function (res) {
      window.location.reload();
    });
  }

  let translationFormDisplay;
  if (loading === false) {
    if (translatedItem === null) {
      if (props.itemType === 'page') {
        translationFormDisplay = (
          <PageForm
            formType="create"
            type="translation"
            order={props.order}
            createTranslation={createTranslation}
            setTranslation={props.setTranslation}
          />
        );
      } else if (props.itemType === 'post') {
        translationFormDisplay = (
          <PostForm
            type="translation"
            order={props.order}
            postType={props.postType}
            createTranslation={createTranslation}
            pageId={props.pageId}
            setTranslation={props.setTranslation}
          />
        );
      }
    } else {
      if (props.itemType === 'page') {
        translationFormDisplay = (
          <PageForm
            formType="edit"
            type="translation"
            order={props.order}
            page={translatedItem}
            setTranslation={props.setTranslation}
          />
        );
      } else if (props.itemType === 'post') {
        translationFormDisplay = (
          <PostForm
            pageId={props.pageId}
            type="translation"
            post={translatedItem}
            setTranslation={props.setTranslation}
          />
        );
      }
    }
  }

  // put the instanse (the translation component) in the page form only if props.formtype is edit
  return <div className="translation">{translationFormDisplay}</div>;
}

export default TranslationForm;
