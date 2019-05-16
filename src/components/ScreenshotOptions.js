import React from 'react';
import {loadImage} from 'blueimp-load-image';

export default class ScreenshotOptions extends React.Component {
  constructor( props ) {
    super( props );
  }

  fileChange = ( file ) => {
    console.log( file );
  }

  render( ) {
    return (
      <>
        <input type="file" onChange={(ev) => this.fileChange(ev.target.files[0])}/>
      </>
    )
  }
}