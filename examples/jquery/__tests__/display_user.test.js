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

  // .mockImplementation( fn(any:any):Function )
  // (公式) Tell the fetchCurrentUser mock function to automatically invoke
  // (自動翻訳) fetchCurrentUserモック関数に自動的に呼び出すように指示する。
  // (公式) its callback with some data
  // (公式) モックの実装(mock Implementation)として使用される関数 fn を受け取ります。 モック自体はそれ自身から出てきたインスタンスと中に与えられた全てのコールをいまだ記録しています - 違いはモックがコールされたときに、実装(mockImplementation)された関数 fn とともに実行されることです。

  // (私見) 複数の関数を持つクラスのモックを作ったとき、特定の関数を mockImplementation によって模倣させることができると思う。
  // この例では、ajaxの結果 user を parseJSON(user) で加工したものを 固定値A に置き換えつつ、ajaxが成功したときに実行する関数==引数として受け取ったコールバック関数 cb(固定値A:JSON) を、非同期ではなく即時、常時実行するために使っている。

  // .mockImplementation( fn(cb(ajax_r_user:JSON):Function):Function )
  // fn(cb(ajax_r_user:JSON):Function):Function は、 fetchCurrentUser(cb(ajax_r_user:JSON):Function):Function に相当。
  // cb(ajax_r_user:JSON):Function は、テスト対象で実装(Implementation)された関数に相当。

  // 模倣元の関数 fetchCurrentUser(cb(ajax_r_user:JSON):Function):Function では、cb(ajax_r_user:JSON):Function == テスト対象からの引数 を受け取り、実行される。
  // モック fetchCurrentUser.mockImplementation(fn(cb(ajax_r_user:JSON):Function):Function):Function では、模倣元の関数 fetchCurrentUser(cb(ajax_r_user:JSON):Function):Function の動きを、 fn(cb(ajax_r_user:JSON):Function):Function で模倣する。この際、 cb(ajax_r_user:JSON):Function == テスト対象からの引数 は、本物のテスト対象からのもの。
  // 模倣元の関数.mockImplementation( 模倣する関数( 本物のテスト対象からの引数:any ):Function ):Function
  //
  // $('#button').click(); が実行されると、模倣元の fetchCurrentUser ではなく、fetchCurrentUser.mockImplementation(fn) で定めたモック fn が実行される。この例では、fn(cb(ajax_r_user:JSON)) の引数 cb(ajax_r_user:JSON):Function に、テスト対象(本物)の無名関数がそのまま代入される。
  //
  // 模倣元、テスト対象、モックでのそれぞれの動き。
  // 模倣元は success: user => callback(parseJSON(user)) 。同名の変数「user」に注意。
  // 模倣元 fetchCurrentUser.js での user :string は、ajaxが返してきた文字列。parseJSON(user) によって加工される。
  // テスト対象 displayUser.js での無名関数の引数 user :JSON には、上記のパースされたJSONが代入されている。
  // モック .mockImplementation(fn) で定めた fn では、模倣元 fetchCurrentUser.js の動きを、モックに書き換える。userに相当するものは、cb(ajax_r_user:JSON)の引数の中身 ajax_r_user:JSON 。
  //
  // モックでは、success のときに実行する、を、無条件で実行。
  // displayUser.js 側の無名関数 の引数を、ajaxからの文字列パース結果ではなく、固定値としている。
  //
  // cb(ajax_r_user:JSON) == callback
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
