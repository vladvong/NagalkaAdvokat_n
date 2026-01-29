"use client";

import React from 'react';
import './Preloader.css';

const Preloader = ({ isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div className="preloader-overlay">
      <div className="preloader-container">
        <div className="dots-loader">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;


