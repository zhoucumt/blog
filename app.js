
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
//var user = require('./routes/user');//自己注释掉
var http = require('http');
var path = require('path');
//自己添加了两行代码
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
//手动添加下面一行
var flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//手动添加下面一行
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser({keepExtensions:true,uploadDir:'./public/images'}));
//自己添加开始
app.use(express.cookieParser());
app.use(express.session({
	secret:settings.cookieSecret,
	key:settings.db,//cookie name
	cookie:{maxAge:1000*60*60*24*30},//30days
	store:new MongoStore({
		db:settings.db
	})
}));
//自己添加结尾
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);//自己注释掉
//app.get('/users', user.list);//自己注释掉

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
routes(app);//自己添加
//
