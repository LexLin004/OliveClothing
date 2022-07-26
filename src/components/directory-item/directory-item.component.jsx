import { useNavigate } from 'react-router-dom';

import {
    BackgroundImage,
    Body,
    DirectoryItemContainer,
  } from './directory-item.styles';
  
  const DirectoryItem = ({ category }) => {
    const { imageUrl, title, route } = category;
    const navigate = useNavigate();

    const onNavigateHandler = () => navigate(route);

    return (
      <DirectoryItemContainer onClick={onNavigateHandler}>
        <BackgroundImage imageUrl={imageUrl} />
        <Body>
          <h2>{title}</h2>
          <p>Shop Now</p>
        </Body>
      </DirectoryItemContainer>
    );
  };
  
  export default DirectoryItem;

// import './directory-item.styles.jsx';

// const DirectoryItem = ({ category }) => {
//     const { imageUrl, title } = category;
//     return (
//         <div className="directory-item-container">
//             <div className="background-image" style={{
//             backgroundImage: `url(${imageUrl})`
//             }} />
//             {/**when you are trying to append some additional CSS 
//              * that's dynamic, you can actually do that in React 
//              * by passing it as a style object. So on any different
//              * component in your JSX, you can actually append custom
//              * styles by giving it the style field.
//              * This style will takes an object where the key is the 
//              * CSS property that you want to modify. So in this case,
//              *  with background image, the value that we need to pass
//              *  it is going to be a string of URL and in the brackets
//              *  is the actual URL string value. */}
//             <div className="body">
//             <h2>{title}</h2>
//             <p>Shop Now</p>
//             </div>
//         </div>
//     )
// }

// export default DirectoryItem