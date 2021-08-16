import { useState } from 'react';
import '../style/menuDrinks.css';

function MenuDrinks(props) {
  const [selectedIndex, setSelcetedIndex] = useState(0);

  let displayDrinksMenu = props.drinksMenu.map((drink, index) => (
    <div key={index}>
      <a
        className={selectedIndex === index ? 'active' : ''}
        onClick={() => setSelcetedIndex(index)}
      >
        {drink.title}
      </a>
    </div>
  ));

  let displaySelcetedContent = props.drinksMenu[selectedIndex].content;
  return (
    <div className="drink-menu">
      <div className="drinks-title">{displayDrinksMenu}</div>
      <div className="outer-border">
        <div
          className="drinks-list"
          dangerouslySetInnerHTML={{ __html: displaySelcetedContent }}
        ></div>
      </div>
    </div>
  );
}

export default MenuDrinks;
