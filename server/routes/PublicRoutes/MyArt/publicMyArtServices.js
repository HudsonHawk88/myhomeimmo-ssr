import express from 'express';
const router = express.Router();
import { poolConnect } from '../../../common/QueryHelpers.js';
const myArt = poolConnect;

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
    const sql = `SELECT * FROM myart_galeriak WHERE isActive='0';`;
    myArt.query(sql, (err, result) => {
        if (!err) {
            let ress = result;
            ress.map((item) => {
                item.kepek = JSON.parse(item.kepek);
                item.isActive = item.isActive === 0 ? true : false;
            });
            res.status(200).send(ress);
        } else {
            res.status(500).send({ err: err });
        }
    });
});

// MYART END

export default router;
