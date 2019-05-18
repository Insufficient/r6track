import React from 'react';
import loadImage from 'blueimp-load-image';

import ocrImg from '../helper/ocr';

const IMAGE_OPTIONS = {
  maxHeight: 1080,
  maxWidth: 1920,
  crop: true,
  canvas: true,
  cover: true
}

export default class FileHandler extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      rectImg: undefined,
      setup: true
    }
    this.dropHandler = this.dropHandler.bind( this );
    this.mouseDown = this.mouseDown.bind( this );
    this.mouseUp = this.mouseUp.bind( this );
    this.mouseMove = this.mouseMove.bind( this );
    this.paint = this.paint.bind( this );
    this.resize = this.resize.bind( this );
    
    this.getRectImg = this.getRectImg.bind( this );

    this.clearSettings = this.clearSettings.bind( this );
  }

  clearSettings( ) {
    this.setState({
      bX: undefined,
      bY: undefined,
      eX: undefined,
      eY: undefined,
      setup: true
    });
    localStorage.removeItem( 'eX' );
    localStorage.removeItem( 'eY' );
    localStorage.removeItem( 'bX' );
    localStorage.removeItem( 'bY' );
  }

  async getRectImg( ) {
    if( this.state.eX ) {
      const canvas = this.state.image;
      if( canvas ) {
        const ctx = canvas.getContext( '2d' );

        let can = document.createElement( 'canvas' );
        can.width = this.state.eX;
        can.height = this.state.eY;
        can.getContext( '2d' ).drawImage( ctx.canvas, -this.state.bX, -this.state.bY );

        let rectImg = can.toDataURL( );
        let res = await ocrImg( rectImg );
        this.props.getPlayers( res );

        localStorage[ 'eX' ] = this.state.eX;
        localStorage[ 'eY' ] = this.state.eY;
        localStorage[ 'bX' ] = this.state.bX;
        localStorage[ 'bY' ] = this.state.bY;
      }
    }
  }

  paint = ( ) => {
    const el = document.getElementById( 'im_canvas' );
    if( el ) {
      const ctx = el.getContext( '2d' );
      if( ctx ) {
        ctx.clearRect( 0, 0, el.width, el.height );
        el.width = window.innerWidth;
        el.height = window.innerHeight;

        if( this.state.image ) {
          ctx.drawImage( this.state.image, 0, 0 );
        }
        if( this.state.bX ) {
          ctx.beginPath( );
          ctx.rect( this.state.bX, this.state.bY, this.state.eX, this.state.eY );
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fill( );
        }
      }
    }
  }

  mouseDown = (ev) => {
    if( this.state.setup && this.state.image ) {
      const canvas = document.getElementById( 'im_canvas' );
      const rect = canvas.getBoundingClientRect( );

      this.setState({
        bX: ev.clientX - rect.left,
        bY: ev.clientY - rect.top,
        eX: undefined,
        eY: undefined,
        mouseDown: true
      });
    }
  }

  mouseMove = (ev) => {
    if( this.state.setup && this.state.image ) {
      const canvas = document.getElementById( 'im_canvas' );
      const rect = canvas.getBoundingClientRect( );
      if( this.state.mouseDown ) {
        this.setState({
          eX: (ev.clientX - rect.left) - this.state.bX,
          eY: (ev.clientY - rect.top) - this.state.bY
        });
      }
    }
  }

  mouseUp = (ev) => {
    if( this.state.setup && this.state.image ) {
      this.setState({
        mouseDown: false,
        setup: false
      }, () => { this.getRectImg( ) } );
    }
  }

  fileChange = (files) => {
    let file = (files.length > 0) ? files[0] : undefined;
    if( file ) {
      let fn = ( im ) => {
        if( im.type === 'error' ) {
          console.log( "Faced an error while loading image" );
          return;
        }
        this.setState( { image: im }, () => {
          this.getRectImg( ) 
        } );
      }

      loadImage(
        file,
        fn,
        IMAGE_OPTIONS
      )

      this.resize( );
    }
  }

  dropHandler = (ev) => {
    ev.preventDefault( );

    let files = [];
    for( let itm of ev.dataTransfer.items ) {
      if( itm.kind === 'file' ) {
        files.push( itm.getAsFile( ) );
      }
    }
    
    this.fileChange( files );
  }

  resize = () => {
    const canvas = document.getElementById( 'im_canvas' );
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.paint( );
  }

  componentDidUpdate( ) {
    window.addEventListener( 'resize', this.resize );
    this.paint( );
  }

  componentWillMount( ) {
    if( 'eX' in localStorage ) {
      this.setState({
        eX: localStorage[ 'eX' ],
        eY: localStorage[ 'eY' ],
        bX: localStorage[ 'bX' ],
        bY: localStorage[ 'bY' ],
        setup: false
      });
    }
  }

  componentWillUnmount( ) {
    window.removeEventListener( 'resize', this.resize );
  }

  render( ) {

    const style = {
      margin: '0 auto',
      maxWidth: '100%',
      borderRadius: '8px',
      border: '1px solid #000',
      boxSizing: 'border-box'
    }

    return (
      <>
        <label htmlFor="file">
          <canvas
            id="im_canvas"
            onDrop={this.dropHandler}
            onDragOver={(ev) => ev.preventDefault( )}
            onMouseDown={this.mouseDown}
            onMouseUp={this.mouseUp}
            onMouseMove={this.mouseMove}
            style={style}
            height="768"
            width="1024"
            title="Drop your screenshot here" />  
        </label>
        <input 
          id="file" 
          type="file" 
          onChange={(ev) => this.fileChange(ev.target.files)}
          style={
            {
              display: 'none'
            }
          }/>

        <br/>

        <button
          onClick={() => this.clearSettings( )}>
          Clear Settings
        </button>
      </>
    )
  }
}