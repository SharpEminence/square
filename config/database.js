var mongoose = require('mongoose');
mongoose.connect('mongodb://beautyapp_user:L1o0KHt54#whtt@172.31.21.96:27017/beautyapp2020',{
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.set('debug', true);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
	console.log("Connection Successful!");
});