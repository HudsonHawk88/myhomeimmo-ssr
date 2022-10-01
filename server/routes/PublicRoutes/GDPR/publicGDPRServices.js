import express from 'express';
const router = express.Router();
import { pool } from '../../../common/QueryHelpers.js';
const GDPR = pool;

// GDPR START

router.get('/', (req, res) => {
    const sql = `SELECT * FROM gdpr;`;
    GDPR.query(sql, (err, result) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send({ err: err });
        }
    });
});

// GDPR END

export default router;
