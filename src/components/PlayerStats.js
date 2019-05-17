import React from 'react';
import debounce from 'lodash/debounce';
import {fetchUserID, fetchUserStats} from '../helper/r6tab';
import './PlayerStats.css';

const SEASON_START = 6;
const SEASON_END = 12;
const MAX_RESULTS = 5;

export default class PlayerStats extends React.Component {

  constructor( props ) {
    super( props );
    this.state = {
      name: this.props.name,
      setup: false,
      results: []
    }
    this.updateStats = this.updateStats.bind( this );
    this.refresh( );
  }

  componentDidUpdate( prevProps ) {
    if( this.props.name !== prevProps.name )
      this.refresh( );
  }

  async updateStats( user_id ) {
    let resp = await fetchUserStats( user_id );
    if( resp.playerfound === false ) {
      this.setState({ 
        setup: false,
        name: this.props.name
      });
      return;
    }

    let cas_kd = resp.seasonal.total_casualkills / resp.seasonal.total_casualdeaths;
    let cas_wr = resp.seasonal.total_casualwins / resp.seasonal.total_casualtotal;
    let rank_kd = resp.seasonal.total_rankedkills / resp.seasonal.total_rankeddeaths;
    let rank_wr = resp.seasonal.total_rankedwins / resp.seasonal.total_rankedtotal;

    let past_ranks = [ ];

    for( let i = SEASON_START; i <= SEASON_END; i++ ) {
      let r = resp[ 'season' + i + 'rank' ];
      if( r !== 0 ) {
        past_ranks.push( r );
      }
    }

    this.setState({
      name: resp.p_name,
      rank_mmr: resp.p_currentmmr,
      level: resp.p_level,
      fav_atk: resp.favattacker.replace( ':', '-' ),
      fav_def: resp.favdefender.replace( ':', '-' ),
      user: resp.p_user,
      rank: resp.p_currentrank,
      cas_kd: cas_kd,
      cas_wr: cas_wr * 100,
      rank_kd: rank_kd,
      rank_wr: rank_wr * 100,
      past_ranks: past_ranks,
      setup: true,
      results: []
    });
    this.props.valid( true );
  }

  refresh = debounce( async () => {

    let users = await fetchUserID( this.props.name );
    if( users.length === 0 ) {
      this.setState({ 
        setup: false,
        name: this.props.name
      });
      this.props.valid( false );
      return;
    } else if( users.length === 1 ) {
      this.updateStats( users[ 0 ].id );
    } else {
      users = users.slice( 0, MAX_RESULTS );
      this.setState({
        results: users
      });
    }
  
  }, 1000 );

  render( ) {
    if( this.state.results.length > 0 ) {
      return (
        <div className="player_stats">
          <h3>Multiple Results Found</h3>
          <ul>
            {this.state.results.map( (user, idx) => {
              return (
                <li 
                  key={idx} 
                  className="multiple_list_item"
                  onClick={() => {
                    this.updateStats( user.id );
                  }}>
                  <h4 className="player_name">{user.name}</h4>
                  <img className="profile_pic_small" 
                    alt="profile_pic"
                    src={`https://ubisoft-avatars.akamaized.net/${user.user}/default_146_146.png`}/>
                </li>
              );
            })}
          </ul>
        </div>
      );
    } else if( this.state.name && (this.state.setup === false) ) {
      return (
        <div className="player_stats">

          <div className="player_stats__header">
            <h3 className="player_name">{this.state.name}</h3>
            <p>Player not found.</p>
          </div>
        </div>
      )
    } else if( this.state.setup === true ) {
      return (
        <div className="player_stats">

          <div className={"player_stats__header " + (this.props.team ? "red_team" : "blue_team")}>
            <h3 className="player_name">{this.state.name}</h3>

            <div className="centered_row">
              <div className="centered_col">
                <a href={`https://r6tab.com/${this.state.user}`}>
                <img className="profile_pic" 
                  alt="profile_pic"
                  src={`https://ubisoft-avatars.akamaized.net/${this.state.user}/default_146_146.png`}/>
                </a>
              </div>

              <div className="clearfix" />

              <div className="centered_col_compact">
                <img className="fav_op" alt="favourite operator"
                  src={`https://r6tab.com/images/operators/${this.state.fav_atk}.png`} />
              </div>
              <div className="centered_col_compact">
                <img className="fav_op" 
                  alt="favourite operator"
                  src={`https://r6tab.com/images/operators/${this.state.fav_def}.png`} />                  
              </div> 
            </div>
            
            <div className="clearfix" />

            <div className="centered_row">
              <div className="centered_col">
                <p>{this.state.level}</p>
                <span>level</span>
              </div>

              <div className="centered_col">
                <p>{this.state.cas_kd.toString( ).slice( 0, 5 )}</p>
                <span>kd</span>
              </div>

              <div className="centered_col">
                <p>{this.state.cas_wr.toString( ).slice( 0, 5 )}</p>
                <span>winrate</span>
              </div>
            </div>

          </div>

          <div className="player_stats__currank">

            <div className="col_header">
              <img className="rank" 
                alt="player rank"
                src={`https://r6tab.com/images/pngranks/${this.state.rank}.png`} />
              <p>Current Season</p>
            </div>

            <div className="centered_row">
              <div className="centered_col">
                <p>{this.state.rank_mmr}</p>
                <span>mmr</span>
              </div>

              <div className="centered_col">
                <p>{this.state.rank_kd.toString( ).slice( 0, 4 )}</p>
                <span>kd</span>
              </div>

              <div className="centered_col">
                <p>{this.state.rank_wr.toString( ).slice( 0, 5 )}</p>
                <span>winrate</span>
              </div>
            </div>

          </div>

          { this.state.past_ranks.length > 0 && 
            <div className="player_stats__pastrank">
              <ul className="past_ranks">
                {this.state.past_ranks.map( (val, idx) => {
                  return (
                    <img 
                      className="past_rank"
                      alt="player's past rank"
                      key={idx} 
                      src={`https://r6tab.com/images/pngranks/${val}.png`} />
                  )
                })}
              </ul>
              <p>Past Seasons</p>
            </div>
          }
        </div>
      );
    }
    return (<></>);
  }
}