import React from 'react';
import './Footer.css'

export default function Footer( ) {
  return (
    <footer>
      <h2>About</h2>
      <p>
        <strong>Created by</strong>: <a href="https://github.com/Insufficient">Insufficient</a>
        <br/>
        <strong>APIs used</strong>: <a href="https://github.com/Tabwire/R6Tab-API">R6Tab</a>, 
        <a href="https://ocr.space/">ocr.space</a>
        <br/>
        <strong>Notes:</strong> ocr.space has an API limit of 60 requested per IP, per day
      </p>

      
    </footer>    
  )
}