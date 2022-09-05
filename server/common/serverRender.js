import React from 'react';
import { resolve } from 'path';
import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { matchPath } from 'react-router-dom';
/* import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'; */
import { Helmet } from 'react-helmet';
import { HelmetProvider } from 'react-helmet-async';

import PublicRoutes from '../../shared/PublicRoutes';
import AdminRoutes from '../../shared/AdminRoutes';
import App from '../../src/App';

/* const statsFile = path.resolve(__dirname, '../build/loadable-stats.json');
const extractor = new ChunkExtractor({ statsFile }) */
const getMetaTags = async (req, activeRoute) => {
    let meta = `<meta name="description" content={{__META_DESCRIPTION__}}/>
  <meta name="og:title" content={{__META_OG_TITLE__}}/>
  <meta name="og:description" content={{__META_OG_DESCRIPTION__}}/>
  <meta name="og:image" content={{__META_OG_IMAGE__}}/>`;
    let ingatlan = {};
    if (req.query.id && req.url.startsWith('/?id=')) {
        const getIngatlanById = activeRoute.fetchInitialData(`/api/ingatlan?id=${req.query.id}`);
        ingatlan = await getIngatlanById.then((ingData) => {
            return ingData;
        });
        meta = `<meta name="description" content="${ingatlan[0].leiras}"/>
      <meta name="og:title" content="${ingatlan[0].cim}"/>
      <meta name="og:description" content="${ingatlan[0].leiras}"/>
      <meta name="og:image" content=${ingatlan[0].kepek && ingatlan[0].kepek.length !== 0 && ingatlan[0].kepek[0].src}/>`;
    }
    return meta;
};

const getRequestPath = (path) => {
    switch (path) {
        case '/':
            '/api/ingatlan';
        case '/ingatlanok':
            '/api/ingatlan';
        default:
            `/api${path}`;
    }
};

export default () => (req, res, next) => {
    /*   const postId = req.query.id;
  const sql = `SELECT kepek, leiras, cim FROM ingatlanok WHERE id='${postId}';`;
  const result = await UseQuery(ocData, sql);
  let datas = result[0];
  let kepek = datas ? JSON.parse(datas.kepek) : [];
  let kep = (datas && kepek.length) > 0 ? kepek[0].src : "https://myhomeimmo.hu/images/logomegoszt2.png"; */
    const allRoutes = PublicRoutes.concat(AdminRoutes);
    let aR = [];
    allRoutes.forEach((route) => {
        /* console.log(matchPath('/ingatlan:id', '/ingatlan?id=3')) */
        if (route.children) {
            aR = route.children.filter((subroute) => matchPath(subroute.path, req.path));
        } else {
            if (matchPath(req.path, route.path)) {
                aR = [route];
            }
            /*       aR = [matchPath(req.path, route.path)] */
        }
        /*   else {
      aR = [matchPath(route.path === req.path)]
    } */
    });
    /*  console.log(aR) */
    const activeRoute = aR[0] || {};
    /* const activeRoute = allRoutes.find((route) => matchPath(req.path, route.path)) || {} */
    /*   console.log('activeRoute', activeRoute); */
    const newPath = getRequestPath(req.path);
    const promise = activeRoute.fetchInitialData ? activeRoute.fetchInitialData(newPath) : Promise.resolve();

    const filePath = resolve(__dirname, '..', 'build/public', 'index.html');

    if (req.url.startsWith('/admin') && !req.cookies.JWT_TOKEN) {
        return res.redirect('/login');
    }

    return promise
        .then(async (data) => {
            const context = { data };
            const markup = ReactDOMServer.renderToString(
                <StaticRouter location={req.path} context={context}>
                    <HelmetProvider>
                        <App serverData={data} history={{}} />
                    </HelmetProvider>
                </StaticRouter>
            );
            /*       let metaTags = await getMetaTags(req, activeRoute); */
            const initialData = `window.__INITIAL_DATA__ = ${JSON.stringify(data)}`;

            // get HTML headers
            const helmet = Helmet.renderStatic();
            const html = `<!DOCTYPE html>
                    <html lang="hu">
                    <head>
                        <title>MyHome - Ingatlanközvetítő iroda</title>
                        ${helmet.title.toString()}
                        ${helmet.meta.toString()}
                        <script>' + ${initialData} + '</script>
                        <meta charset="utf-8" />
                        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
                        <link rel="icon" href="/images/logo.jpg" />
                        <link rel="stylesheet" href="/styles/bootstrap-utilities.min.css" />
                        <link rel="stylesheet" href="/styles/bootstrap.min.css" />
                        <script src="/scripts/bootstrap.min.js"></script>
                        <script src="/scripts/kit.fontawesome.min.js"></script>
                        <link rel="stylesheet" href="/styles/slicknav.min.css" />
                        <link rel="stylesheet" href="/styles/navigation-icons.css" />
                        <link rel="stylesheet" href="/styles/notifications.css" />
                        <link rel="stylesheet" href="/styles/react-responsive-carousel.css" />
                        <link rel="stylesheet" href="/styles/wysiwyg.css" />
                        <link rel="stylesheet" href="/styles/react-image-gallery.css" />
                        <link rel="stylesheet" href="/styles/style.css" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <meta name="theme-color" content="#000000" />
                        <link rel="apple-touch-icon" href="/images/logo192.png" />
                      
                    </head>
                    <body>
                        <script async defer crossorigin="anonymous" src="https://connect.facebook.net/hu_HU/sdk.js#xfbml=1&version=v13.0&appId=996475810974610&autoLogAppEvents=1" nonce="BYaRYZHj"></script>
                        <noscript>You need to enable JavaScript to run this app.</noscript>
                        <div id="root">
                        ${markup}
                        </div>
                         <script defer src="/client_bundle.js"></script>
                    </body>
                    </html>
                `;
            res.send(html);
        })
        .catch((error) => console.log('errrrrr: ', error));

    /*   return res.render('index', { metaTags: metaTags, reactApp: markup, initialData: initialData }); */

    /*     let html = htmlData
    .replace('<script>window.__INITIAL_DATA__ = "__DATA__"</script>', `<script>window.__INITIAL_DATA__ = ${serialize(data)}</script>`)
    .replace('<div id="root"></div>',`<div id="root">${markup}</div>`)
    return res.send(html); */
    /* next(); */

    /* htmlData.replace('<script>window.__INITIAL_DATA__ = "__DATA__"</script>', `<script>window.__INITIAL_DATA__ = ${serialize(adat)}</script>`)
  .replace('<div id="root"></div>',
    `<div id="root">
    ${ReactDOMServer.renderToString(
      <StaticRouter location={req.url} context={adat}>
          <App data={adat} />
      </StaticRouter>
    )}
    </div>`)
res.send(htmlData) */

    /*     htmlData.replace('<script>window.__INITIAL_DATA__ = "__DATA__"</script>', `<script>window.__INITIAL_DATA__ = ${serialize(adat)}</script>`)
      .replace('<div id="root"></div>',
        `<div id="root">
        ${ReactDOMServer.renderToString(
          <ChunkExtractorManager extractor={extractor}>
            <StaticRouter location={req.url} context={adat}>
                {extractor.collectChunks(<App />)}
            </StaticRouter>
          </ChunkExtractorManager>
        )}
        </div>`) */
};
