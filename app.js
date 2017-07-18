var express = require("express");
//追加
const line = require('node-line-bot-api');
const bodyParser = require('body-parser');
//
var app = express();

//画面をつくるためのエンジンを追加
app.set('view engine', 'ejs'); //追加

// 送信元の検証にrawBodyが必要
app.use(bodyParser.json({
  verify(req,res,buf) {
    req.rawBody = buf
  }
}));

// LINE BOT SDK 初期化
line.init({
  accessToken: '{YOUR_ACCESS_TOKEN}',
  channelSecret: '{YOUR_CHANNEL_SECRET}'
});


// サーバーの設定
var server = app.listen(3000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});

//画面をつくってみよう
app.get("/", function(req, res, next){ //追加
    res.render('index.ejs', {text: 'こんにちは'}); //追加
}); //追加

// 具体的な振る舞い
app.get("/hello", function(req, res, next){
  var message = 'こんにちは。';
  var hour = new Date().getHours();
  if(hour < 12) {
    message = 'おはようございます';
  } else if(hour >= 16) {
    message = 'こんばんは';
  }
  message += ' \n「' + req.query.text + '」といいましたか？' //削除
  res.json(message); //'こんにちは'をmessageに書き換え
});

app.post('/webhook/', line.validator.validateSignature(), (req, res) => {
  // get content from request body
  const promises = req.body.events.map(event => {
    // reply message
    return line.client.replyMessage({
      replyToken: event.replyToken,
      messages: [{ // 最大5件
        type: 'text',
        text: event.message.text
      }]
    });
  });
  Promise.all(promises).then(() => res.json({ success: true }));
});
