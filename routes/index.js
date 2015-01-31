
/*
 * GET home page.
 */

/*exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};*/
//自己注释掉上面6-8
//自己添加下面的代码
var crypto = require('crypto'),//
User = require('../models/user.js');//
module.exports = function(app){
	app.get('/',function(req,res){
		res.render('index',{
			title:'主页',
			user : req.session.user,
			success : req.flash('success').toString(),
			error : req.flash('error').toString()
		});
	});
	//真尼玛坑啊，下面的路由规则添加后要在命令行窗口中重启一下node app，我擦，浪费哥哥二十分钟
	//差点开始怀疑人生了。。。
	/*app.get('/nswb',function(req,res){
		res.send('hello world');
	});*/


	app.get('/reg',checkNotLogin);
	app.get('/reg',function(req,res){
		res.render('reg',{
			title:'注册',
			user : req.session.user,
			success : req.flash('success').toString(),
			error : req.flash('error').toString()
		});
	});

	app.post('/reg',checkNotLogin);
	app.post('/reg',function(req,res){
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];
		if(password_re !=password){
			req.flash('error','两次输入的密码不一致!');
			return res.redirect('/reg');
		}
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			name : req.body.name,
			password : password,
			email : req.body.email
		});
		//检查用户是否已经存在
		User.get(newUser.name,function(err,user){
			if(user){
				req.flash('error','用户已存在');
				return res.redirect('/reg');
			}
			newUser.save(function(err,user){
				if(err){
					req.flash('error',err);
					return res.redirect('/reg');
				}
				req.session.user = user;
				req.flash('success','注册成功!');
				res.redirect('/');
			});
		});
	});


	//app.get('/login',function(req,res){
	//	res.render('login',{title:'登录'});
	//});
//这里是错误的根本
//卡了很久
	app.get('/login',checkNotLogin);
	app.get('/login',function(req,res){
    res.render('login',{
      title:'登录',
      user : req.session.user,
      success : req.flash('success').toString(),
      error : req.flash('error').toString()
    });
  });


	//登录
	app.post('/login',checkNotLogin);
	app.post('/login',function(req,res){
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		User.get(req.body.name,function(err,user){
			if(!user){
				req.flash('error','用户不存在!');
				return res.redirect('/login');
			}
			if(user.password != password){
				req.flash('error','密码错误');
				return res.redirect('/login');
			}
			req.session.user = user;
			req.flash('success','登录成功');
			res.redirect('/');
		});
	});

	app.get('/post',checkLogin);
	app.get('/post',function(req,res){
		res.render('post',{
			title:'发表',
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		});
	});

	app.post('/post',checkLogin);
	app.post('/post',function(req,res){
	});

	//登出
	app.get('/logout',checkLogin);
	app.get('/logout',function(req,res){
		req.session.user = null;
		req.flash('success','登出成功');
		res.redirect('/');
	});

	function checkLogin(req,res,next){
		if(!req.session.user){
			req.flash('error','未登录!');
			res.redirect('/login');
		}
		next();
	}

	function checkNotLogin(req,res,next){
		if(req.session.user){
			req.flash('error','已登录');
			res.redirect('back');
		}
		next();
	}
};