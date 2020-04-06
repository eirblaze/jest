// Copyright 2004-present Facebook. All Rights Reserved.

const $ = require('jquery');

function parseJSON(user) {
  return {
    fullName: user.firstName + ' ' + user.lastName,
    loggedIn: true,
  };
}

/**
 * 特定のURLにアクセスし、ユーザーの状態を取得する。
 * この例では、URLリクエストの中身をハードコーディングしてある。
 * @param {Function} callback ajax成功後に実行する関数。
 */
function fetchCurrentUser(callback) {
  return $.ajax({
    success: user => callback(parseJSON(user)),
    type: 'GET',
    url: 'http://example.com/currentUser',
  });
}

module.exports = fetchCurrentUser;
