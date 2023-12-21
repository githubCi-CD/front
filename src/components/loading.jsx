import React, { useState, CSSProperties } from 'react';
import { BeatLoader } from 'react-spinners';

function Loading(props) {
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState('#ffffff');
  return (
    <div className='sweet-loading'>
      <BeatLoader color='#05507d' />
      <p>Loading...</p>
    </div>
  );
}

export default Loading;
