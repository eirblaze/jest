// Copyright 2004-present Facebook. All Rights Reserved.

/* global document */

'use strict';

jest.mock('../fetchCurrentUser.js');

it('displays a user after a click', () => {
  // Set up our document body
  document.body.innerHTML =
    '<div>' +
    '  <span id="username" />' +
    '  <button id="button" />' +
    '</div>';

  // This module has a side-effect
  require('../displayUser');

  const $ = require('jquery');
  const fetchCurrentUser = require('../fetchCurrentUser');

  // Tell the fetchCurrentUser mock function to automatically invoke
  // its callback with some data
  // cb == callback
  // .mockImplementation(fn) Functionのfnの返り値の模倣を作る。これで、モックになる。
  fetchCurrentUser.mockImplementation(cb => {
    cb({
      fullName: 'Johnny Cash',
      loggedIn: true,
    });
  });

  // Use jquery to emulate a click on our button
  $('#button').click();

  // .toBeCalled == .toHaveBeenCalled
  // モック関数が呼ばれたかを確認するには.toHaveBeenCalledを使用して下さい。(公式)
  // ここでは、dispkayUser.js 側の $('#button').click(); によって、 fetchCurrentUser が呼ばれたかどうかを確認している。
  expect(fetchCurrentUser).toBeCalled();

  // Assert that the fetchCurrentUser function was called, and that the
  // #username span's inner text was updated as we'd expect it to.
  // fetchCurrentUser関数(モック)が呼び出され、＃usernameスパンの内部テキストが予想どおりに更新されたことをアサートします。
  expect($('#username').text()).toEqual('Johnny Cash - Logged In');
});
