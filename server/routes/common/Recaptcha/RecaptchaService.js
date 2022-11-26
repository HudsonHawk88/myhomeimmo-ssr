import express from 'express';
import fetch from 'isomorphic-fetch';
const router = express.Router();

// RECAPTCHA START

router.post('/', (req, res) => {
    const { response } = req.headers;
    const secret = process.env.reachaptchaSecretKey;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${response}`;

    fetch(url, {
        method: 'POST'
    }).then((value) => {
        if (value.success) {
            res.status(200).send({ success: true });
        } else {
            res.status(500).send({ success: false });
        }
    });
});

// RECAPTCHA END

export default router;
