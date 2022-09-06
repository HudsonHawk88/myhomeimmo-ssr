/* eslint-disable no-eval */
// DEPENDENCIES
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import cookieParser from 'cookie-parser';
/* import ejs from 'ejs'; */

// const publicAuthSerice = from ("./routes/PublicRoutes/AuthService/AuthService");
import adminAuthService from './routes/AdminRoutes/AdminAuthServices/AdminAuthServices.js';
//const publicusersServices = from ('./routes/PublicRoutes/UserServices/UserService');
import adminusersServices from './routes/AdminRoutes/AdminUsersServices/AdminUsersServices.js';
import adminrolesServices from './routes/AdminRoutes/AdminRoles/AdminRoles.js';
import ingatlanokServices from './routes/PublicRoutes/Ingatlanok/IngatlanokService.js';
import adminIngatlanSzolg from './routes/AdminRoutes/AdminIngatlanSzolgaltatasokService/AdminIngatlanSzolgaltatasokService.js';
import adminPenzugySzolg from './routes/AdminRoutes/AdminPenzugyiSzolgaltatasokService/AdminPenzugyiSzolgaltatasokService.js';
import publicIngatlanSzolg from './routes/PublicRoutes/IngatlanSzolgService/IngatlanSzolgServices.js';
import publicPenzugySzolg from './routes/PublicRoutes/PenzugyiSzolgService/PenzugyiSzolgServices.js';
import adminIngatlanokService from './routes/AdminRoutes/IngatlanokServices/IngatlanokService.js';
import adminGdpr from './routes/AdminRoutes/AdminGDPR/AdminGDPRServices.js';
import publicGdpr from './routes/PublicRoutes/GDPR/publicGDPRServices.js';
import publicRolunk from './routes/PublicRoutes/Rolunk/PublicRolunkServices.js';
import adminRolunk from './routes/AdminRoutes/AdminRólunkServices/AdminRolunkServices.js';
import adminKapcsolat from './routes/AdminRoutes/AdminKapcsolatServices/AdminKapcsolatServices.js';
import publicKapcsolat from './routes/PublicRoutes/KapcsolatService/KapcsolatServices.js';
import adminMyArt from './routes/AdminRoutes/AdminMyArtGaleriaServices/AdminMyArtGaleriaServices.js';
import publicMyArt from './routes/PublicRoutes/MyArt/publicMyArtServices.js';
import orszagokService from './routes/common/OrszagokService/OrszagokService.js';
import telepulesekService from './routes/common/TelepulesekService/TelepulesekService.js';
import mailerService from './routes/common/MailerService/MailerService.js';
import OptionServices from './routes/common/OptionsService/OptionsServices';
import serverRender from './common/serverRender';
//const server = https.createServer(
//  {
//    key: fs.readFileSync(process.env.KEY_FILE),
//    cert: fs.readFileSync(process.env.CERT_FILE)
//  },
//    app
//);

// VARIABLES

import routes from './routes.json';

dotenv.config({
    path: path.resolve(__dirname, '../.env')
});
// from ('dotenv').config({
//   path: path.join(__dirname,'.myhome.env'),
// });
const app = express();
const router = express.Router();
//const https = from ("https");
const host = process.env.HOST ? process.env.HOST : '127.0.0.1';
const port = process.env.PORT ? process.env.PORT : 3000;

const server = http.createServer(app);

/* app.set('view engine', 'ejs'); */
/* ejs.openDelimiter = '{{';
ejs.closeDelimiter = '}}';
ejs.delimiter = ''; */
app.use(
    express.json({
        limit: '150mb'
    })
);
app.use(cookieParser());
app.use(routes, (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', ['http://192.168.11.167:3000', 'http://localhost:3000']);
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    return next();
});

app.options('*', cors());
app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
/* app.engine('.ejs', from ('ejs').__express);
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views')) */

/* ejs.open = '{{';
ejs.close = '}}'; */

const actionIndex = (req, res, next) => {
    console.log(req);
    serverRender()(req, res, next);
    /* next(req, res, next); */
};

app.get('/', actionIndex);
app.get('/admin', actionIndex);
app.use(express.static('build/public'));

app.use(['/api/admin'], adminAuthService);
// PUBLIC USERS
// //app.use(["/users"], publicusersServices);
// ADMINROLES
app.use(['/api/admin/roles'], adminrolesServices);
// ADMINUSERS
app.use(['/api/admin/users'], adminusersServices);
// INGATLANOK
app.use(['/api/ingatlan'], ingatlanokServices);
app.use(['/api/admin/ingatlanok'], adminIngatlanokService);
// SZOLGALTATASOK
app.use(['/api/admin/ingatlanszolg'], adminIngatlanSzolg);
app.use(['/api/admin/penzugyszolg'], adminPenzugySzolg);
app.use(['/api/ingatlanszolg'], publicIngatlanSzolg);
app.use(['/api/penzugyszolg'], publicPenzugySzolg);
// GDPR
app.use(['/api/admin/adatkezeles'], adminGdpr);
app.use(['/api/adatkezeles'], publicGdpr);
// ROLUNK
app.use(['/api/admin/rolunk'], adminRolunk);
app.use(['/api/rolunk'], publicRolunk);
// KAPCSOLAT
app.use(['/api/admin/kapcsolat'], adminKapcsolat);
app.use(['/api/kapcsolat'], publicKapcsolat);
// MYART
app.use(['/api/admin/myart'], adminMyArt);
app.use(['/api/myart'], publicMyArt);
// ORSZAGOK
app.use(['/api/orszagok'], orszagokService);
// TELEPULESEK
app.use(['/api/telepulesek'], telepulesekService);
// MAIL
app.use(['/api/contactmail'], mailerService);
// OPTIONS
app.use(['/api/options'], OptionServices);

/* app.use('*', actionIndex); */
app.get('*', actionIndex);

server.listen(port, host);

console.log(`Server running at https://${host}:${port}/`);
