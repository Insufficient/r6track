import React from 'react';
import {loadImage} from 'blueimp-load-image';

export default class Canvas extends React.Component {
  constructor( props ) {
    super( props );
  }

  drawImage = () => {
    const el = document.getElementById( 'img_canvas' );
    if( this.props.image && el ) {
      const ctx = el.getContext( '2d' );
      if( ctx ) {
        ctx.drawImage( this.props.image, 0, 0 );
      }
    }
  }

  render( ) {
    return (
      <canvas 
        id="img_canvas" 
        width={this.props.width} 
        height={this.props.height}/>
    )
  }
}