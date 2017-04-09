import { polyfill } from 'es6-promise';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import config from '../webpack.config.babel';
import Express from 'express';

import dataFriends from "./data/friends";
import dataPlays from "./data/plays";

import fetchFriendsPlays from  "./api";

// used by the APP
const app = new Express();
// used by the Users API
const user = new Express();
// used by the Friends API
const friends = new Express();
// used by the PlayList API
const plays = new Express();

const port = process.env.PORT || 3000;
const portUser = 8005;
const portFriends = 8000;
const portPlays = 8001;

const compiler = webpack(config);

/* */
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Supporting the User API
user.get('/user*', (req, res) => {
  if (req.originalUrl === '/user') {
    // All Users information must be returned at this point
    // Fetch all Users - Friends + Plays
    return fetchFriendsPlays('all', req.originalUrl).then((data) => {
      res.send(data);
    });

  } else {

    // User specific information must be fetched and returned
    // Fetch only one Users - Friends + Plays
    return fetchFriendsPlays('one', req.originalUrl).then((data) => {
      res.send(data);
    });
  }

});

// Supporting the Friends API on Port 8000
friends.get('/friends*', (req, res) => {
   res.send(JSON.stringify(dataFriends));
});

// Supporting the PlayList API on Port 8001
plays.get('/plays*', (req, res) => {
  res.send(JSON.stringify(dataPlays));
});

app.listen(port, error => {
  /* eslint-disable no-console */
  if (error) {
    console.error(error);
  } else {
    console.info(
      '🌎 Listening on App port %s. Open up http://localhost:%s/ in your browser.',
      port,
      port
    );
  }
  /* eslint-enable no-console */
});

user.listen(portUser, error => {
  /* eslint-disable no-console */
  if (error) {
    console.error(error);
  } else {
    console.info(
      '🌎 Listening on User API port %s. Open up http://localhost:%s/ in your browser.',
      portUser,
      portUser
    );
  }
});

friends.listen(portFriends, error => {
  /* eslint-disable no-console */
  if (error) {
    console.error(error);
  } else {
    console.info(
      '🌎 Listening on Friends API port %s. Open up http://localhost:%s/ in your browser.',
      portFriends,
      portFriends
    );
  }
});

plays.listen(portPlays, error => {
  /* eslint-disable no-console */
  if (error) {
    console.error(error);
  } else {
    console.info(
      '🌎 Listening on Plays API port %s. Open up http://localhost:%s/ in your browser.',
      portPlays,
      portPlays
    );
  }
});
