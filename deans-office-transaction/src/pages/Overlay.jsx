import React from 'react';

function Overlay({ onClose }) {
  return (
    <div className="overlay" onClick={onClose}></div>
  );
}

export default Overlay;