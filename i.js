
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const bodyparser = require('body-parser');
const express = require('express');
const expressip = require('express-ip');
var cookieParser = require('cookie-parser');
const httpsPort = 7000;
const fs = require('fs');
const requestIp = require('request-ip');
var session = require('express-session');
var key = fs.readFileSync('./ssl/key.pem', 'utf8');
var cert = fs.readFileSync('./ssl/server.crt', 'utf8');
const https = require('https');
const upload = require('./controller/Control/controleArquivos');
const fileUpload = require('express-fileupload');

/******************************************* */

const corsOptions={
    credentials: true,
    origin:true
}

const uuid = require('uuid').v4;
const cors = require('cors');

app = express();
app.use(fileUpload())
app.use(cookieParser())
 app.use(bodyparser.urlencoded({
      extended: true
 }));
app.use(bodyparser.json());
app.use(cors(corsOptions));
app.use(expressip().getIpInfoMiddleware);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({
    secret: 'SecretString',
    name: 'AppPdf',
    resave: false,
    genid: function (req) {
        return uuid();
    },
    saveUninitialized: false,
    maxAge: 600000,
    cookie: { secure: true }
})
);
const ipMiddleware = function (req, res, next) {
    const ip = req.headers["x-forwarded-for"]

    const clientIp = requestIp.getClientIp(req);
    req.session.ip = ip;
    next();
};
app.use(ipMiddleware);
app.use(cookieParser())
app.disable('x-powered-by');
//app.use(connectionMiddleware(pool));
var credentials = {
    key: key,
    cert: cert
};
app.post('/upload2',upload.uploadFile2)
app.post('/pdf/upload2',upload.uploadFile2)


app.get('/pdf',(req,res)=>{
    res.render('index')
})


if (cluster.isMaster) {
    console.log('Master process is running');
    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    try{
    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(httpsPort, () => {
        console.log("Https server listing on port : " + httpsPort);
    });
}catch(erro){console.log(erro)}
}
