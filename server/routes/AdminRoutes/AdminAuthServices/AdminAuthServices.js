import { jwtparams, UseQuery, poolConnect, validateToken } from '../../../common/QueryHelpers.js';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const adminusers = poolConnect;
const router = express.Router();

router.post('/token', async (req, res) => {
    const token = req.headers.refreshtoken;
    const user = await validateToken(token, jwtparams.refresh);
    // console.log("TOKEN: ", token);
    // console.log("USER: ", user);
    if (user === null) {
        const sql = `UPDATE adminusers SET token=NULL WHERE token='${token}';`;
        adminusers.query(sql, (error) => {
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
        const sql = `SELECT username, roles, avatar, email, nev, telefon, isErtekesito FROM adminusers WHERE token = '${token}';`;
        const result = await UseQuery(adminusers, sql);
        if (result.length === 0) {
            res.sendStatus(401);
        } else {
            const user = result[0];
            let ertekesito = {};
            const getUserAvatarSql = `SELECT avatar FROM adminusers WHERE email='${user.email}'`;
            const userAvatar = await UseQuery(adminusers, getUserAvatarSql);
            user.roles = user.roles ? user.roles : [];
            const avatar = userAvatar ? userAvatar[0].avatar : [];
            user.telefon = user.telefon ? user.telefon : {};
            user.nev = user.nev ? user.nev : {};
            user.isErtekesito = user.isErtekesito === 0 ? true : false;
            if (!user.isErtekesito) {
                const getAdminSql = `SELECT nev, telefon, email, avatar FROM adminusers WHERE username='berkimonika';`;
                const admin = await UseQuery(adminusers, getAdminSql);
                ertekesito['nev'] = JSON.parse(admin[0].nev);
                ertekesito['telefon'] = JSON.parse(admin[0].telefon);
                ertekesito['email'] = admin[0].email;
                ertekesito['avatar'] = JSON.parse(admin[0].avatar);
            }
            //sign my jwt
            const payLoad = { name: user.username, roles: user.roles, email: user.email, telefon: user.telefon, nev: user.nev, isErtekesito: user.isErtekesito };
            //sign a brand new accesstoken and update the cookie
            const token = jwt.sign(payLoad, jwtparams.secret, { algorithm: 'HS256', expiresIn: jwtparams.expire });
            //maybe check if it succeeds..
            res.setHeader('set-cookie', [`JWT_TOKEN=${token}; httponly; path=/`]);
            res.status(200).send({
                user: {
                    username: user.username,
                    avatar: JSON.parse(avatar),
                    roles: JSON.parse(user.roles),
                    email: user.email,
                    telefon: JSON.parse(user.telefon),
                    nev: JSON.parse(user.nev),
                    isErtekesito: user.isErtekesito
                },
                ertekesito: ertekesito !== {} ? ertekesito : null,
                token: token
            });
        }
    }
});

router.post('/login', async (req, res) => {
    try {
        let userObj = req.body;
        // userObj = JSON.parse(userObj);
        if (userObj) {
            const sql = `SELECT username, password, roles, avatar, nev, telefon, email, isErtekesito FROM adminusers WHERE email = '${userObj.email}'`;

            const result = await UseQuery(adminusers, sql);
            //fail
            if (result.length === 0) {
                res.status(403).send({ err: 'Nincs ilyen felhasználó regisztrálva!' });
            } else {
                //compare salted password
                const saltedPassword = await result[0].password;

                const successResult = bcrypt.compareSync(userObj.password, saltedPassword);

                //logged in successfully generate session
                if (successResult === true) {
                    const user = result[0];
                    let ertekesito = {};
                    // const getUserAvatarSql = `SELECT avatar FROM adminusers WHERE email='${user.email}'`;
                    // const userAvatar = await UseQuery(adminusers, getUserAvatarSql);
                    user.roles = user.roles ? user.roles : null;
                    let avatar = user.avatar ? user.avatar : [];
                    user.telefon = user.telefon ? user.telefon : {};
                    user.nev = user.nev ? user.nev : {};
                    user.isErtekesito = user.isErtekesito === 0 ? true : false;
                    if (!user.isErtekesito) {
                        const getAdminSql = `SELECT nev, telefon, email, avatar FROM adminusers WHERE username='berkimonika';`;
                        const admin = await UseQuery(adminusers, getAdminSql);
                        ertekesito['nev'] = JSON.parse(admin[0].nev);
                        ertekesito['telefon'] = JSON.parse(admin[0].telefon);
                        ertekesito['email'] = admin[0].email;
                        ertekesito['avatar'] = JSON.parse(admin[0].avatar);
                    }
                    //sign my jwt
                    const payLoad = { name: user.username, roles: user.roles, email: user.email, telefon: user.telefon, nev: user.nev, isErtekesito: user.isErtekesito };
                    const token = jwt.sign(payLoad, jwtparams.secret, { algorithm: 'HS256', expiresIn: jwtparams.expire });
                    const refreshtoken = jwt.sign(payLoad, jwtparams.refresh, { algorithm: 'HS256' });
                    const updateSql = `UPDATE adminusers SET token = '${refreshtoken}' WHERE email = '${user.email}';`;
                    //save the refresh token in the database
                    adminusers.query(updateSql, (errrrr) => {
                        if (!errrrr) {
                            res.setHeader('set-cookie', [`JWT_TOKEN=${token}; httponly; path=/`]);
                            res.status(200).send({
                                user: {
                                    username: user.username,
                                    avatar: JSON.parse(avatar),
                                    roles: JSON.parse(user.roles),
                                    email: user.email,
                                    telefon: JSON.parse(user.telefon),
                                    nev: JSON.parse(user.nev),
                                    isErtekesito: user.isErtekesito
                                },
                                ertekesito: ertekesito !== {} ? ertekesito : null,
                                refreshToken: refreshtoken
                            });
                        }
                    });
                    //maybe check if it succeeds..
                } else {
                    res.status(403).send({ err: 'Helytelen jelszó!' });
                }
            }
        } else {
            res.status(400).send({ err: 'Email cím és jelszó megadása kötelező' });
        }
    } catch (ex) {
        console.error(ex);
    }
});

router.post('/logout', (req, res) => {
    //logging out
    const token = req.headers.token;
    if (token) {
        const sql = `UPDATE adminusers SET token=NULL WHERE token='${token}';`;
        adminusers.query(sql, (error) => {
            if (!error) {
                res.clearCookie('JWT_TOKEN');
                res.status(200).send({ msg: 'Sikeresen kijelentkezett!' });
            } else {
                res.status(400).send({ err: error });
            }
        });
    } else {
        res.status(400).send({ err: 'Token megadása kötelező' });
    }
});

export default router;
