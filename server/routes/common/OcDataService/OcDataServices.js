import { pool, UseQuery } from '../../../common/QueryHelpers.js';
import express from 'express';
import fs from 'fs';
import path from 'path';
const router = express.Router();
const ocData = pool;

// OCDATA START

router.get('/*', (req, res, next) => {
    const indexPath = path.resolve(__dirname, '../../../../', 'public', 'index.html');
    res.setHeader('Content-Type', 'text/html');
    fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
        if (err) {
            console.error('Error during file reading', err);
            res.status(404).send(err.message);
        }
        const postId = req.query.id;
        const sql = `SELECT kepek, leiras, cim FROM ingatlanok WHERE id='${postId}';`;
        const result = await UseQuery(sql);
        if (!result) return res.status(404).send('Post not found');
        let datas = result[0];
        let kepek = datas && datas.kepek ? JSON.parse(datas.kepek) : [];
        let kep = kepek.length > 0 ? kepek[0].src : 'https://myhomeimmo.hu/images/logomegoszt2.png';
        htmlData = htmlData
            .replace('<title>MyHome - Ingatlanközvetítő iroda</title>', `<title>${datas ? datas.cim : 'MyHome - Ingatlanközvetítő iroda'}</title>`)
            .replace('__META_OG_TITLE__', datas ? datas.cim : 'Myhome, ahová jó megérkezni!')
            .replace('__META_OG_DESCRIPTION__', datas ? datas.leiras : 'MyHome, ingatlanközvetítés')
            .replace('__META_DESCRIPTION__', datas ? datas.leiras : 'MyHome, ingatlanközvetítés')
            .replace('__META_OG_IMAGE__', kep);
        return res.send(htmlData);
    });
});

// OCDATA END

export default router;
