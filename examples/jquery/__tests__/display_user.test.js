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
  // .mockImplementation(fn) 引数に入ったコールバックFunctionのfnの返り値の模倣を作る。これで、モックになる。
  //
  // $('#button').click(); が実行された後、fetchCurrentUserが起動する。その際に、モックで指示した変数が自動代入されている。
  //
  // 模倣元は success: user => callback(parseJSON(user)) 。同名の変数「user」に注意。
  // fetchCurrentUser.js での user :string は、ajaxが返してきた文字列。parseJSON(user) によって加工される。
  // displayUser.js での無名関数の引数 user :JSON には、上記のパースされたJSONが代入されている。
  //
  // .mockImplementationでは、上記のfetchCurrentUser.js での動きを、模倣に書き換える。
  // $('#button').click(); が実行されると、本物ではなく、モックのfetchCurrentUserが実行される。
  // cbには、本物と同じく、displayUser.js 側の無名関数が代入される。
  // モックでは、success のときに実行する、を、無条件で実行。
  // displayUser.js 側の無名関数 の引数を、ajaxからの文字列パース結果ではなく、固定値としている。
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
