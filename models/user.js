var mongodb = require('./db.js');

function User(user){
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
};

module.exports = User;

User.prototype.save =function(callback){
	var user = {
		name : this.name,
		password : this.password,
		email : this.email
	};
	//打开数据库
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//将用户数据插入users集合
			collection.insert(user,{
				safe : true
			},function(err,user){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,user[0]);
			});
		});
	});
};

//读取用户信息
User.get = function(name,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('users',function(err,collection){//擦，错误就在这里，原来第二个参数写成db了
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				name : name
			},function(err,user){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,user);
			});
		});
	});
};