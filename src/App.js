import React from "react";
import "./App.css";
import FileHandler from "./components/FileHandler";
import PlayerStats from "./components/PlayerStats";
import Footer from "./components/Footer";

const NUM_PLAYERS = 10;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      player_names: [],
      img: undefined,
      teamIdx: 5,
      validity: new Array(NUM_PLAYERS).fill(true)
    };
  }

  handleChange = (idx, ev) => {
    let p_names = this.state.player_names.slice();

    p_names[idx] = ev.target.value;
    this.setState({
      player_names: p_names
    });
  };

  getPlayers = players => {
    this.setState({
      player_names: players.filter(itm => itm.length > 0).slice(0, NUM_PLAYERS)
    });
  };

  adjustTeamIdx = idx => {
    this.setState({
      teamIdx: idx
    });
  };

  markValidity = (idx, status) => {
    let valid = this.state.validity.slice();

    valid[idx] = status;
    this.setState({
      validity: valid
    });
  };

  render() {
    return (
      <>
        <div className="container">
          <h1>Rainbow Six Track</h1>

          <h2>Instructions</h2>
          <ul className="instructions">
            <li>
              Press <i>F12</i> in-game to take a screenshot of the scoreboard
              (opened by <i>Tab</i> key)
            </li>
            <li>
              Click the white box with a black border below and upload your
              screenshot, default location is <br />
              <span className="code">
                C:\Users\User\Pictures\Uplay\Tom Clancy's Rainbow Six® Siege
              </span>
            </li>
            <li>
              Click and drag a window that only contains the player names
              (without any other text or icons). <br />
              If you selected a window incorrectly, click on the "Clear
              Settings" button
            </li>
            <li>
              Scroll down and the extracted player names will appear within 10
              seconds along with their stats. <br />
            </li>
            <li>
              When you start a new game, your window settings will be saved so
              just upload your screenshot!
            </li>
            <li>
              For a demo/example picture, click{" "}
              <a href="/screenshot.png">here</a>
            </li>
          </ul>
        </div>

        <FileHandler getPlayers={this.getPlayers} />

        <div className="container">
          <h2>Players</h2>
          <ul>
            {this.state.player_names.map((val, idx) => {
              return (
                <li className="input_list " key={idx}>
                  <input
                    className={
                      "input_name " +
                      (idx < this.state.teamIdx
                        ? "blue_team_text"
                        : "red_team_text")
                    }
                    value={val}
                    onChange={ev => this.handleChange(idx, ev)}
                  />
                  {!this.state.validity[idx] && (
                    <span className="input_error">Player not found</span>
                  )}
                  <button
                    title="Indicates that this player is from another team"
                    onClick={() => this.adjustTeamIdx(idx)}
                  >
                    Switch Team
                  </button>
                </li>
              );
            })}
          </ul>
          {this.state.player_names.length < NUM_PLAYERS && (
            <button
              onClick={() => {
                this.setState(pState => {
                  let arr = pState.player_names.slice();
                  arr.push("");
                  return {
                    player_names: arr
                  };
                });
              }}
            >
              Add Player
            </button>
          )}

          <div className="player_profiles">
            {this.state.player_names.map((val, idx) => {
              return (
                <PlayerStats
                  key={idx}
                  name={val}
                  team={idx < this.state.teamIdx ? 0 : 1}
                  valid={this.markValidity.bind(null, idx)}
                />
              );
            })}
          </div>

          <Footer />
        </div>
      </>
    );
  }
}
