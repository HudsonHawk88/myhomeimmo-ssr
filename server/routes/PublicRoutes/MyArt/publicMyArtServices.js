import express from 'express';
const router = express.Router();
import { getJSONfromLongtext, pool } from '../../../common/QueryHelpers.js';
const myArt = pool;

// MYART START

router.get('/altalanos', (req, res) => {
    const sql = `SELECT * FROM myart_altalanos;`;
    myArt.query(sql, (err, result) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send({ err: err });
        }
    });
});

router.get('/galeriak', (req, res) => {
    const sql = `SELECT * FROM myart_galeriak WHERE isActive='1';`;
    myArt.query(sql, (err, result) => {
        if (!err) {
            let ress = result.map((item) => {
                return getJSONfromLongtext(item, 'toBool');
            });
            res.status(200).send(ress);
        } else {
            res.status(500).send({ err: err });
        }
    });
});

// MYART END

export default router;
