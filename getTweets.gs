// Twitter のBearer Tokenとデータを書き込むシート名 を記述
const token =
 ' write token data ';
 
const sheetName = 'ツイート';
 
// Twitterデータを取得する関数
 
function getTweets () {
 //  スプレッドシートのデータを定義
 //  Twitterのデータを書き込みたいシート、および最後のTwitter IDを取得する
 
 const ss = SpreadsheetApp.getActiveSpreadsheet ();
 const tweetSheet = ss.getSheetByName (sheetName);
 const newest_id_cell = ss.getSheetByName ('meta_data').getRange ('B1');
 const newest_id = newest_id_cell.getValue ();
 
 // Twitterからデータを取得する
 
 const headers = {
   Authorization: 'Bearer ' + token,
 };
 
 const options = {
   headers: headers,
   nethod: 'get',
 };
 
 const requestUrl =
   'https://api.twitter.com/2/tweets/search/recent?query=query-word lang:ja -from:query-word -is:retweet&tweet.fields=created_at&expansions=author_id&user.fields=name,username,url,description&max_results=50&since_id=' +
   newest_id;
 const response = UrlFetchApp.fetch (requestUrl, options);
 const res = JSON.parse (response);
 
 
 
 //  ツイートデータを書き込み、newest_id を書き換える。
 // 取得したツイート数が0の場合は何もしない
 
 if (res.meta.result_count != 0) {
 
   res.data.forEach (element => {
     tweetSheet.insertRows (2, 1);
     tweetSheet.getRange (2, 1).setValue (element.created_at);
     tweetSheet.getRange (2, 2).setValue (element.text);
     tweetSheet
       .getRange (2, 3)
       .setValue (getScreenName (element.author_id, res.includes.users));
     tweetSheet
       .getRange (2, 4)
       .setValue (getName (element.author_id, res.includes.users));
     tweetSheet
       .getRange (2, 5)
       .setValue (getDescription (element.author_id, res.includes.users));
   });
     ss
       .getSheetByName ('meta_data')
       .getRange ('B1')
       .setValue (res.meta.newest_id);
 
   console.log("Twitterデータの書き込みを完了しました。");
 
 } else {
 
  console.log("ツイートを取得できませんでした。");
 }
}
 
// username, name, description を取得するためのサブルーチン
 
function getScreenName (author_id, users) {
 let value = users.find (element => author_id === element.id);
 return value.username;
}
 
function getName (author_id, users) {
 let value = users.find (element => author_id === element.id);
 return value.name;
}
 
function getDescription (author_id, users) {
 let value = users.find (element => author_id === element.id);
 return value.description;
}
 
