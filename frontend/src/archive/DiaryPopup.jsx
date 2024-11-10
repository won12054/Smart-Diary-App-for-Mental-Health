import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


// const DiaryPopup = () => (
//   <Popup trigger={<button>Open Popup</button>} position="right center">
//     <div>Popup content here!</div>
//   </Popup>
// );

const DiaryPopup = () => (
  <Popup
    trigger={<button>Open Custom Popup</button>}
    position="right center"
    contentStyle={{
      width: '300px',
      padding: '20px',
      backgroundColor: '#f1f1f1',
      textAlign: 'center',
    }}
    modal
  >
    <div>Custom Popup Content</div>
  </Popup>
);


export default DiaryPopup;