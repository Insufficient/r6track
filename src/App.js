import React from 'react';
import './App.css';
import FileHandler from './components/FileHandler';
import PlayerStats from './components/PlayerStats';
import Footer from './components/Footer';

const NUM_PLAYERS = 10;

export default class App extends React.Component {
  constructor( props ) {
    super( props );

    this.state = {
      player_names: [],
      setup: true,
      img: undefined,
      teamIdx: 5,
      validity: new Array( NUM_PLAYERS ).fill( true )
    }

    this.handleChange = this.handleChange.bind( this );
    this.getPlayers = this.getPlayers.bind( this );
    this.adjustTeamIdx = this.adjustTeamIdx.bind( this );
    this.markValidity = this.markValidity.bind( this );
  }

  handleChange( idx, ev ) {
    let p_names = this.state.player_names.slice( );

    p_names[ idx ] = ev.target.value;
    this.setState({
      player_names: p_names
    })
  }

  getPlayers( players ) {
    this.setState({
      player_names: players.filter( itm => itm.length > 0 ).slice( 0, NUM_PLAYERS )
    });
  }

  adjustTeamIdx( idx ) {
    this.setState({
      teamIdx: idx
    });
  }

  markValidity( idx, status ) {
    let valid = this.state.validity.slice( );

    valid[ idx ] = status;
    this.setState({
      validity: valid
    });
  }

  render( ) {
    return (
      <>
        <div className="App">
          <h1>Rainbow Six Track</h1>
          <h2>Setup OCR</h2>
          <p>
            Click the box below to upload a screenshot of your scoreboard, click and
             drag a window that contains only the player names.</p>
          <p>
            The default location
            that R6 stores your screenshots is <span className="code">C:\Users\User\Pictures\Uplay\Tom Clancy's Rainbow Six® Siege</span></p>
        </div>

        <FileHandler setup={this.state.setup} getPlayers={this.getPlayers}/>

        <div className="App">
          <h2>Players</h2>
          <ul>
            {this.state.player_names.map( (val, idx) => {
              return (
                <li 
                  className={"input_list " + (!this.state.validity[idx] && "input_invalid") }
                  key={idx}>
                  <input
                    className={"input_name " + (idx < this.state.teamIdx ? "blue_team_text" : "red_team_text")}
                    value={val}
                    onChange={(ev) => this.handleChange(idx, ev)}/>
                  <button 
                    title="Indicates that this player is from another team"
                    onClick={() => this.adjustTeamIdx( idx )}>
                    Switch Team
                  </button>
                </li>
              )
            })}
          </ul>
          {this.state.player_names.length < NUM_PLAYERS &&
            <button onClick={ () => {
              this.setState( (pState) => {
                let arr = pState.player_names.slice( );
                arr.push( "" );
                return {
                  player_names: arr
                };
              });
            }}>Add Player</button>
          }

          <div className="player_profiles">
          {this.state.player_names.map( (val, idx) => {
            return (
              <PlayerStats 
                key={idx} 
                name={val}
                team={idx < this.state.teamIdx ? 0 : 1}
                valid={this.markValidity.bind( null, idx )}/>
            )
          })}
          </div>

          <Footer />
        </div>
      </>
    );
  }
}