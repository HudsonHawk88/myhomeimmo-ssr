// const { Pool } = require("pg");
// const poolJson = require("./pool.json");
const mysql = require('mysql2');
// const poolJson = require("./pool.json");
const db_params = {
    host: process.env.dbhost,
    user: process.env.dbuser,
    password: process.env.dbpass,
    database: process.env.database,
    port: process.env.dbport
};
const users = mysql.createPool(db_params);
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT = {
    secret: process.env.JWT_SECRET,
    refresh: process.env.JWT_REFRESH_SECRET,
    expire: process.env.JWT_EXPIRE
};

function validateToken(token, secret) {
    try {
        const result = jwt.verify(token, secret);

        return {
            name: result.name,
            email: result.email
        };
    } catch (ex) {
        return null;
    }
}

router.post('/token', async (req, res) => {
    const token = req.headers.refreshtoken;
    const user = validateToken(token, JWT.refresh);

    if (user === null) {
        const sql = `UPDATE users SET token=NULL WHERE token='${token}';`;
        users.query(sql, (error) => {
            if (!error) {
                res.sendStatus(200);
            } else {
                res.status(500).send({ err: error });
            }
        });
        return;
    } else {
        //now that we know the refresh token is valid
        //lets take an extra hit the database
        const result = users.query('SELECT username FROM users WHERE token = $1', [token]);
        if (result.rowCount === 0) {
            res.sendStatus(401);
        } else {
            const user = result.rows;
            //sign my jwt
            const payLoad = { name: user.username, email: user.email };
            //sign a brand new accesstoken and update the cookie
            const token = jwt.sign(payLoad, JWT.secret, { algorithm: 'HS256', expiresIn: JWT.expire });
            //maybe check if it succeeds..
            res.setHeader('set-cookie', [`JWT_TOKEN=${token}; httponly;`]);
            res.status(200).send({ user: { username: user.username, avatar: user.avatar }, token: token });
        }
    }
});

router.post('/login', async (req, res) => {
    try {
        let userObj = req.body;
        if (userObj) {
            const sql = 'SELECT username, password, avatar FROM users WHERE email = $1';
            const result = await users.query(sql, [userObj.email]);

            //fail
            if (result.rowCount === 0) res.status(403).send({ err: 'Nincs ilyen felhasználó regisztrálva!' });
            else {
                //compare salted password
                const saltedPassword = result.rows[0].password;
                const successResult = await bcrypt.compare(userObj.password, saltedPassword);

                //logged in successfully generate session
                if (successResult === true) {
                    const user = result.rows[0];
                    //sign my jwt
                    const payLoad = { name: user.username, email: user.email };
                    const token = jwt.sign(payLoad, JWT.secret, { algorithm: 'HS256', expiresIn: JWT.expire });
                    const refreshtoken = jwt.sign(payLoad, JWT.refresh, { algorithm: 'HS256' });

                    //save the refresh token in the database
                    users.query('UPDATE users SET token = $1 WHERE email = $2', [refreshtoken, user.email]);
                    //maybe check if it succeeds..
                    res.setHeader('set-cookie', [`JWT_TOKEN=${token}; httponly;`]);
                    res.status(200).send({ user: { username: user.username, avatar: user.avatar, email: user.email }, token: token, refreshToken: refreshtoken });
                } else {
                    res.status(403).send({ err: 'Helytelen jelszó!' });
                }
            }
        } else {
            res.status(400).send({ err: 'Felhasználó adatainak megadása kötelező' });
        }
    } catch (ex) {
        console.error(ex);
    }
});

router.post('/register', async (req, res) => {
    const felvitelObj = req.body;
    if (felvitelObj) {
        felvitelObj = JSON.parse(JSON.stringify(felvitelObj));
        //the hash has the salt
        const hash = await bcrypt.hash(felvitelObj.password, 10);
        //store user, password and role
        const sql = `CREATE TABLE IF NOT EXISTS users (
            id text PRIMARY KEY DEFAULT uuid_generate_v4(),
            nev json DEFAULT NULL,
            cim json DEFAULT NULL,
            telefon json DEFAULT NULL,
            avatar jsonb DEFAULT NULL,
            username text DEFAULT NULL,
            email text DEFAULT NULL,
            password text DEFAULT NULL,
            token text DEFAULT NULL
          );`;
        users.query(sql, async (error) => {
            if (!error) {
                const sqlEmail = 'SELECT email FROM users WHERE email = $1';
                const resultEmail = await users.query(sqlEmail, [felvitelObj.email]);

                //success, user is not there create it
                if (resultEmail.rowCount === 0) {
                    const sqlInsert = `INSERT INTO users (nev, cim, telefon, avatar, username, email, password)
                VALUES ($1, $2, $3, $4, $5, $6, $7);`;
                    users.query(sqlInsert, [felvitelObj.nev, felvitelObj.cim, felvitelObj.telefon, JSON.stringify(felvitelObj.avatar), felvitelObj.username, felvitelObj.email, hash], (err) => {
                        if (!err) {
                            res.status(200).send({ msg: 'User sikeresen létrehozva!' });
                        } else {
                            res.status(400).send({ err: 'User hozzáadása sikertelen!' });
                        }
                    });
                } else {
                    res.status(400).send({ err: 'Ezzel a felhasználónévvel / email címmel már regisztráltak!' });
                }
            }
        });
    } else {
        res.status(400).send({ err: 'Felhasználó adatainak megadása kötelező' });
    }
});

router.post('/logout', (req, res) => {
    //logging out
    const token = req.headers.token;
    if (token) {
        const sql = `UPDATE users SET token=NULL WHERE token=$1;`;
        users.query(sql, [token], (error) => {
            if (!error) {
                res.status(200).send({ msg: 'Sikeresen kijelentkezett!' });
            } else {
                res.status(400).send({ err: error });
            }
        });
    }
});

export default router;
