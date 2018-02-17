import React from 'react';
import ReactDOM from 'react-dom';
import {SCOPES, STATE} from '../../constants/auth'

class Stream extends React.Component {

  componentDidUpdate() {
    const audioElement = ReactDOM.findDOMNode(this.refs.audio);
    if (!audioElement) { return; }

    const { activeTrack } = this.props;

    if (activeTrack) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }

  openAuthWindow(onAuth) {
    let authorizeUrl = window.spotifyApi.createAuthorizeURL(SCOPES, STATE, true)
    authorizeUrl = authorizeUrl.replace(/response_type=code/gi, 'response_type=token')

    // register auth dispatch function to window so authorize child window can call it after
    window.onAuth = onAuth
    this.popupCenter(authorizeUrl, 'Musyc', 400, 600)
  }


  popupCenter(url, title, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox
    const dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    const dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    const left = ((width / 2) - (w / 2)) + dualScreenLeft;
    const top = ((height / 2) - (h / 2)) + dualScreenTop;
    const newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) {
      newWindow.focus();
    }

    return newWindow;
  }

  render() {
    const {user, tracks = [], activeTrack, onAuth, onPlay} = this.props;
    return (
      <div>
        <div>
          {
            user ?
              <div>{user.display_name}</div> :
              <button onClick={() => {
                this.openAuthWindow(onAuth)
              }} type="button">Login</button>
          }
        </div>
        <br/>
        <div>
          {
            tracks.map((track, key) => {
              return (
                <div className="track" key={key}>
                  {key + 1} {track.track.name}
                  &nbsp;<button type="button" onClick={() => onPlay(track)}>Play</button>
                </div>
              );
            })
          }
        </div>
        {
          activeTrack ?
            <div className="active-track">
              <audio id="audio" controls ref="audio" src={activeTrack.track.preview_url}/>
            </div>:
            null
        }
      </div>
    )
  }
}

export default Stream;