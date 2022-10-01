import { pool } from '../../../common/QueryHelpers.js';
import express from 'express';
const router = express.Router();
const telepulesek = pool;

// TELEPULESEK START

router.get('/', (req, res) => {
    const id = req.headers.id;
    const like = req.headers.like;
    const irszam = req.headers.irsz;
    if (id) {
        const sql = `SELECT * FROM telep_1 WHERE id='${id}';`;
        telepulesek.query(sql, (err, result) => {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(500).send({ err: err });
            }
        });
    } else if (irszam) {
        const sql = `SELECT * FROM telep_1 WHERE irszam='${irszam}';`;
        telepulesek.query(sql, (err, result) => {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(500).send({ err: err });
            }
        });
    } else if (like) {
        const sql = `SELECT * FROM telep_1 WHERE telepulesnev LIKE '${like}';`;
        telepulesek.query(sql, (err, result) => {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(500).send({ err: err });
            }
        });
    } else {
        const sql = `SELECT telepulesnev, id, geoLat, geoLong, irszam, megye, megyekod FROM telep_1 GROUP BY telepulesnev;`;
        telepulesek.query(sql, (err, result) => {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(500).send({ err: err });
            }
        });
    }
});

// TELEPULESEK END

export default router;
