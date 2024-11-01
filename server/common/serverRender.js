import React from 'react';
import { resolve } from 'path';
import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { matchPath } from 'react-router-dom';
/* import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'; */
import { Helmet } from 'react-helmet';
import { Microservices } from '../../shared/MicroServices';

import PublicRoutes from '../../shared/PublicRoutes';
import AdminRoutes from '../../shared/AdminRoutes';
import { App } from '../../src/App';
import { array } from 'prop-types';

/* const statsFile = path.resolve(__dirname, '../build/loadable-stats.json');
const extractor = new ChunkExtractor({ statsFile }) */
const getMetaTags = async (req, activeRoute) => {
    let meta = `<meta name="description" content={{__META_DESCRIPTION__}}/>
  <meta name="og:title" content={{__META_OG_TITLE__}}/>
  <meta name="og:description" content={{__META_OG_DESCRIPTION__}}/>
  <meta property="og:url" content="__OG_URL__" />
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
      <meta name="og:url" content="${process.env.url + ingatlan[0].id}"/>
      <meta name="og:image" content=${ingatlan[0].kepek && ingatlan[0].kepek.length !== 0 && ingatlan[0].kepek[0].src}/>
      `;
    }
    return meta;
};

const getRequestPath = (path, url, originalUrl) => {
    let newPath = '';
    if (path.startsWith('/api')) {
        newPath = path;
    } else if (url.includes('ingatlan?id=')) {
        newPath = '/api' + url;
    } else {
        switch (path) {
            case '/': {
                newPath = '/api/ingatlan';
            }

            case '/ingatlanok': {
                newPath = '/api/ingatlan';
            }

            /*  default: {
            console.log('ANYÁD3');
            newPath = `/api${path}`;
        } */
        }
    }

    /*     const regtext = '/^/api//';
    const regexp = new RegExp('/^/api//');

    if (originalUrl.includes('/api')) {
        newPath = originalUrl;
        console.log('ORIGNNALURL: ', url);
    } else if (originalUrl === '/') {
        newPath = '/api/ingatlan/';
    } else {
        newPath = '/api' + path;
    } */
    /*     console.log('issdfjdsfj: ', url.startsWith('ingatlan?id=') || url !== '/api/'); */
    /* if (url.startsWith('ingatlan?id=') || url === '/api/') {
        newPath = '/api' + url;
    } else {
        switch (path) {
            case '/api': {
                newPath = '/api/ingatlan';
            }
            case '/': {
                console.log('ANYÁD1');
                newPath = '/api/ingatlan';
            }

            case '/ingatlanok': {
                console.log('ANYÁD2');
                newPath = '/api/ingatlan';
            }

            default: {
                console.log('ANYÁD3');
                newPath = `/api${path}`;
            }
        }
    }
 */
    return newPath;
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
    /*  const newPath = getRequestPath(req.path, req.url); */
    const newPath = getRequestPath(req.path, req.url, req.originalUrl);
    /*   console.log('NEWPATH: ', newPath); */
    const promise = activeRoute.fetchInitialData ? activeRoute.fetchInitialData(newPath) : Promise.resolve();

    const filePath = resolve(__dirname, '..', 'build/public', 'index.html');

    if (req.url.startsWith('/admin') && !req.cookies.JWT_TOKEN) {
        return res.redirect('/login');
    }

    fs.readFile(filePath, 'utf8', (err, htmlData) => {
        if (err) {
            return res.status(404).end();
        }

        if (req.url.startsWith('/admin') && !req.cookies.JWT_TOKEN) {
            return res.redirect('/login');
        }

        return promise
            .then(async (data) => {
                const context = { data };
                const markup = ReactDOMServer.renderToString(
                    <StaticRouter location={req.path} context={context}>
                        <App serverData={data} history={{}} />
                    </StaticRouter>
                );
                /*       let metaTags = await getMetaTags(req, activeRoute); */
                const initialData = `window.__INITIAL_DATA__ = ${data ? JSON.stringify(data) : JSON.stringify([])}`;

                // get HTML headers
                const helmet = Helmet.renderStatic();
                let resx;
                if (data) {
                    resx = res.send(
                        htmlData
                            .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
                            /*     // append the extra js assets
          .replace("</body>", extraChunks.join("") + "</body>") */
                            // write the HTML header tags
                            .replace('<title>MyHome - Ingatlanközvetítő iroda</title>', helmet.title.toString() + helmet.meta.toString())

                            .replace('<noscript>You need to enable JavaScript to run this app.</noscript>', '')
                            .replace('</head>', '<script>' + initialData + '</script>' + '</head>')
                            .replace('__OG_TITLE__', data && Array.isArray(data) && data.length > 0 && data[0].cim)
                            .replace('__OG_DESCRIPTION__', data && Array.isArray(data) && data.length > 0 && data[0].leiras)
                            .replace('__OG_URL__', data && Array.isArray(data) && data.length > 0 && process.env.REACT_APP_url + data[0].id)
                            .replace(
                                '__OG_IMAGE__',
                                data && Array.isArray(data) && data.length > 0 && data[0].kepek && Array.isArray(data[0].kepek) && data[0].kepek.length > 0 && data[0].kepek[0].src
                            )
                    );
                } else {
                    resx = res.send(
                        htmlData
                            .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
                            /*     // append the extra js assets
          .replace("</body>", extraChunks.join("") + "</body>") */
                            // write the HTML header tags
                            .replace('<title>MyHome - Ingatlanközvetítő iroda</title>', helmet.title.toString() + helmet.meta.toString())

                            .replace('<noscript>You need to enable JavaScript to run this app.</noscript>', '')
                            .replace('</head>', '<script>' + initialData + '</script>' + '</head>')
                    );
                }

                return resx;
            })
            .catch((error) => console.log('errrrrr: ', error));
    });

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
