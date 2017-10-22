const http =require('http');
const express =require('express');
const cors =require('cors');
const morgan =require('morgan');
const bodyParser =require('body-parser');
const config =require('./config.json');
const router =require('./router');

const app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/', express.static('dist'))

router(app);

app.server.listen(process.env.PORT || config.port, () => {
	console.log(`Started on port ${app.server.address().port}`);
});	
module.exports=app;
