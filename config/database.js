var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/SQUARE_DATABASE',{
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.set('debug', true);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
	console.log("Connection Successful!");
});