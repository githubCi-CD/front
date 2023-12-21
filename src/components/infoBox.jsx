import React from 'react';
import '../App.css';

function InfoBox(props) {
  const { width, bgColor, color, content, contentV } = props.infoProps;
  const { unit } = props;
  const divStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width,
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: bgColor,
    borderRadius: '10px',
    boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.25)',
    boxSizing: 'border-box',
  };
  const pStyle = {
    color: color,
  };
  return (
    <div style={divStyle}>
      <p>{content}</p>
      <p style={pStyle}>
        {contentV} ({unit})
      </p>
    </div>
  );
}

export default InfoBox;
