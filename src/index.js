import SpotifyWebApi from 'spotify-web-api-node';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import configureStore from './stores/configureStore';
import * as actions from './actions';
import App from './components/App';
import Callback from './components/Callback';
import Stream from './components/Stream/';
import { CLIENT_ID, REDIRECT_URI } from './constants/auth';

window.spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  redirectUri: REDIRECT_URI
});

const store = configureStore()

const history = syncHistoryWithStore(browserHistory, store)
alert(process.env.PUBLIC_URL + '/')
console.log(process.env.PUBLIC_URL + '/')
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path={'/'} component={App}>
        <IndexRoute component={Stream}/>
        <Route path={process.env.PUBLIC_URL + '/'} component={Stream}/>
        <Route path={process.env.PUBLIC_URL + '/callback'} component={Callback}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);

module.hot.accept();