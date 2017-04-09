import { polyfill } from 'es6-promise';
import fetch from 'isomorphic-fetch';

/**
 * @params - mode - String - Mode helps to identify what type of data to return
 * @params - uri  - String - uri help us to identify which users data must be returned
 * @return - res  - Object - Merged results form Friends and Plays list API would be returned
 */
const fetchFriendsPlays = (mode, uri) => {
  var res = {};

  if (mode === 'one') {

    // return only one users friends
    return fetch('http://localhost:8000/friends', {method: 'GET'})
    .then((response) => {
      return response.json().then((data) => {
        data.friends.forEach((f) => {
          var cmpStr = '/user/' + f.username;

          if (cmpStr.indexOf(uri) !== -1) {
            res = {
              uri: uri,
              username: f.username,
              friends: f.friends.length
            };
          }
        });

        // Now fecthing the fetch the plays list data
        return fetch('http://localhost:8001/plays')
          .then((response) => {
            return response.json().then((data) => {
              // merging the data with the existing data
              return {
                ...res,
                tracks: data.users[0].plays.length
              }
            })
        });

      });
    });

  } else {
    // return all the Friends
    // return only one users friends
    return fetch('http://localhost:8000/friends', {method: 'GET'})
    .then((response) => {
      return response.json().then((data) => {
        var results = [];

        var res = {
          uri: uri,
          username: data.friends[0].username,
          friends: data.friends[0].friends.length
        };

        // Now fecthing the fetch the plays list data
        return fetch('http://localhost:8001/plays')
          .then((response) => {
            return response.json().then((data) => {
              // merging the data with the existing data
              return {
                ...res,
                tracks: data.users[0].plays.length
              }
            })
        });

      });
    });
  }
};

export default fetchFriendsPlays;
