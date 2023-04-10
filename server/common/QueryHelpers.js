import { createPool } from 'mysql2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { restart } from 'nodemon';
import { type } from 'os';

dotenv.config({
    path: path.resolve(__dirname, '../.env')
});
const db_params = {
    host: process.env.dbhost,
    user: process.env.dbuser,
    password: process.env.dbpass,
    database: process.env.database
};
const pool = createPool(db_params);

const getIngatlanId = async (reqID) => {
    let id = undefined;
    if (reqID !== undefined) {
        id = parseInt(reqID, 10);
    } else {
        const isExist = await isIngatlanokTableExists();
        if (isExist) {
            const getLastIdSql = `SELECT MAX(id) as id FROM ingatlanok;`;
            let result = await UseQuery(getLastIdSql);
            let newID = result[0].id;
            if (newID && newID !== 'null') {
                id = newID + 1;
            } else {
                id = 1;
            }
        } else {
            id = 1;
        }
    }

    return id;
};

const stringToBool = (value) => {
    let result = false;
    if (value === 'true' || value === '1') {
        result = true;
    }

    return result;
};

const getId = async (reqID, tableName) => {
    let id = undefined;
    if (reqID !== undefined) {
        id = parseInt(reqID, 10);
    } else {
        const isExist = await isTableExists(tableName);
        if (isExist) {
            const getLastIdSql = `SELECT MAX(id) as id FROM ${tableName};`;
            let result = await UseQuery(getLastIdSql);
            let newID = result[0].id;
            if (newID && newID !== 'null') {
                id = newID + 1;
            } else {
                id = 1;
            }
        } else {
            id = 1;
        }
    }

    return id;
};

const docHeight = () => {
    const body = document.body;
    const html = document.documentElement;
    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
};

function verifyJson(input) {
    try {
        JSON.parse(input);
    } catch (e) {
        return false;
    }
    return true;
}

const getJSONfromLongtext = (object, direction = 'toBool') => {
    const keys = Object.keys(object);
    let newObj = {};
    keys.forEach((key) => {
        if (
            key === 'isHirdetheto' ||
            key === 'isKiemelt' ||
            key === 'isErkely' ||
            key === 'isLift' ||
            key === 'isAktiv' ||
            key === 'isUjEpitesu' ||
            key === 'isErtekesito' ||
            key === 'isActive' ||
            key === 'isTetoter' ||
            key === 'isVip'
        ) {
            if (direction) {
                if (direction === 'toBool') {
                    if (object[key] === 0 || object[key] === '0') {
                        newObj[key] = false;
                    } else {
                        newObj[key] = true;
                    }
                } else if (direction === 'toNumber') {
                    if (object[key] === false || object[key] === 'false') {
                        newObj[key] = 0;
                    } else {
                        newObj[key] = 1;
                    }
                }
            }
            return newObj[key];
        } else {
            if (verifyJson(object[key])) {
                newObj[key] = JSON.parse(object[key]);
            } else {
                newObj[key] = object[key];
            }
            return newObj[key];
        }
    });
    return newObj;
};

const getDataFromDatabase = async (method, sql, datas) => {
    return new Promise((resolve, reject) => {
        if (method === 'POST' && method === 'PUT') {
            pool.query(sql, [datas], (error, result) => {
                if (!error) {
                    return resolve(result);
                } else {
                    return 'Hiba történt a lekérdezéskor, kérem próbálja újra!';
                }
            });
        } else {
            if (method === 'GET') {
                pool.query(sql, (error, result) => {
                    if (!error) {
                        return resolve(result);
                    } else {
                        return 'Hiba történt a lekérdezéskor, kérem próbálja újra!';
                    }
                });
            } else {
                pool.query(sql, (error, result) => {
                    if (!error) {
                        return resolve(result);
                    } else {
                        return 'Hiba történt a törlés közben, kérem próbálja újra!';
                    }
                });
            }
        }
    });
};

const jwtparams = {
    secret: process.env.JWT_SECRET,
    refresh: process.env.JWT_REFRESH_SECRET,
    expire: process.env.JWT_EXPIRE
};

const getKepekForXml = (kepek, data) => {
    let kepekdata = '';
    kepek.forEach((kep) => {
        if (kep.isCover) {
            kepekdata += `<image url='${kep.src}' main-image="t"/>`;
        } else {
            kepekdata += `<image url='${kep.src}'/>`;
        }
    });
    return kepekdata;
};

const isObject = (object) => {
    return object !== null && typeof object === 'object';
};

const getNameByFieldName = (fieldName) => {
    switch (fieldName) {
        case 'id':
            return 'Id';
        case 'refid':
            return 'Referencia id';
        case 'tipus':
            return 'Típus';
        case 'altipus':
            return 'Altípus';
        case 'cim':
            return 'Hirdetés címe';
        case 'leiras':
            return 'Hiretés leírása';
        case 'irsz':
            return 'Irányítószám';
        case 'telepules':
            return 'Település';
        case 'ar':
            return 'Ingatlan ár';
        case 'penznem':
            return 'Pénznem';
        case 'statusz':
            return 'Ingatlan státusza';
        case 'allapot':
            return 'Ingatlan állapota';
        case 'emelet':
            return 'Emelet';
        case 'alapterulet':
            return 'Ingatlan alapterülete';
        case 'telek':
            return 'Telek alapterülete';
        case 'telektipus':
            return 'Telek típusa';
        case 'beepithetoseg':
            return 'Telek beépíthetősége';
        case 'szobaszam':
            return 'Szobák száma';
        case 'felszobaszam':
            return 'Félszobák száma';
        case 'epitesmod':
            return 'Ingatlan építési módja';
        case 'villanygogyaszt':
            return 'Ingatlan átlagos éves villanyfogyasztása';
        case 'gazfogyaszt':
            return 'Ingatlan átlagos éves gázfogyasztása';
        case 'etanusitvany':
            return 'Ingatlan energiatanusítványa';
        case 'futes':
            return 'Fűtés módja';
        case 'viz':
            return 'Víz';
        case 'gaz':
            return 'Gáz';
        case 'villany':
            return 'Villany';
        case 'szennyviz':
            return 'Szennyvíz';
        case 'isHirdethető':
            return 'Hirdethetőség';
        case 'isKiemelt':
            return 'Kiemeltség';
        case 'isErkely':
            return 'Erkély';
        case 'isTetoter':
            return 'Tetőtér';
        case 'isLift':
            return 'Lift';
        case 'isAktiv':
            return 'Publikus';
        case 'isUjEpitesu':
            return 'Újépítés';
        case 'isVip':
            return 'VIP';
        case 'kaucio':
            return 'Kaució';
        case 'officeid':
            return 'Iroda';
        case 'rendeltetes':
            return 'Ingatlan rendeltetése';
        case 'hirdeto':
            return 'Ingatlan hirdetője';
        case 'rogzitIdo':
            return 'Rögzíttés ideje';
    }
};

const getChangedField = (newObject, oldObject) => {
    const newObjKeys = Object.keys(newObject);
    const oldObjKeys = Object.keys(oldObject);
    let fieldNames = [];

    /* if (oldObjKeys.length !== newObjKeys.length) return false; */

    for (let key of oldObjKeys) {
        let newValue = newObject[key];
        let oldValue = oldObject[key];

        if (key === 'isHirdethető' || key === 'isKiemelt' || key === 'isErkely' || key === 'isTetoter' || key === 'isLift' || key === 'isAktiv' || key === 'isUjEpitesu' || key === 'isVip') {
            oldValue = oldObject[key] === '1' || oldObject[key] === 1 ? true : false;
            newValue = oldObject[key] === '1' || oldObject[key] === 1 ? true : false;
        }
        if (key === 'ar' || key === 'kaucio') {
            oldValue = oldObject[key].replace(/\s/g, '');
            newValue = newObject[key].replace(/\s/g, '');
        }

        console.log('OLD VALUE: ', oldValue);
        console.log('NEW VALUE: ', newValue);
        console.log(typeof newObject, Array.isArray(newObject));
        const isObjects = isObject(newValue) && isObject(oldValue);

        if ((isObjects && !getChangedField(newValue, oldValue)) || (!isObjects && newValue !== oldValue)) {
            fieldNames.push({ fieldName: getNameByFieldName(key), regiErtek: oldValue, ujErtek: newValue });
        }
    }

    return fieldNames;
};

const renderValtozatasok = (valtozasok) => {
    return valtozasok.map((item) => {
        return `<li>${item.fieldName}: Régi érték: ${item.regiErtek} Új érték: ${item.ujErtek}</li>`;
    });
};

const UseQuery = async (sql) => {
    return new Promise((data) => {
        // console.log(pool)
        pool.query(sql, function (error, result) {
            // change db->connection for your code
            if (error) {
                // console.log(error);
                throw error;
            } else {
                try {
                    data(result);
                } catch (error) {
                    data([]);
                    throw error;
                }
            }
        });
    });
};

const getBooleanFromNumber = (value) => {
    if (value === 1 || value === '1') {
        return true;
    } else {
        return false;
    }
};

const getNumberFromBoolean = (value) => {
    if (value === 'true' || value === true) {
        return 1;
    } else {
        return 0;
    }
};

const validateToken = async (token, secret) => {
    try {
        const result = jwt.verify(token, secret);
        return {
            name: result.name,
            telefon: result.telefon,
            roles: result.roles,
            email: result.email,
            avatar: result.avatar,
            nev: result.nev,
            isErtekesito: Boolean(result.isErtekesito)
        };
    } catch (ex) {
        return null;
    }
};

const hasRole = (userRoles, minRoles) => {
    let result = false;
    userRoles.forEach((userrole) => {
        if (minRoles.includes(userrole.value)) {
            result = true;
        }
    });

    return result;
};

const isTableExists = async (tableName) => {
    const isExistSql = `SHOW TABLES LIKE "${tableName}";`;
    const isExist = await UseQuery(isExistSql);

    if (isExist.length !== 0) {
        return true;
    } else {
        return false;
    }
};

const isAdminUsersTableExists = async (adminusers) => {
    const isExistSql = `SHOW TABLES LIKE "adminusers";`;
    const isExist = await UseQuery(isExistSql);

    if (isExist.length !== 0) {
        return true;
    } else {
        return false;
    }
};

const getIngatlanokByKm = async (telepules, km) => {
    const getCoordinatesSql = `SELECT geoLong, geoLat FROM telep_1 WHERE telepulesnev='${telepules}'`;
    const coordinates = await UseQuery(getCoordinatesSql);
    const sssql = `LEFT JOIN (SELECT (6371 * acos(cos(radians(${coordinates[0].geoLat})) * cos(radians(geoLat)) * cos(radians(geoLong) - radians(${coordinates[0].geoLong})) + sin(radians(${
        coordinates[0].geoLat
    })) * sin(radians(geoLat)))) AS distance, telepulesnev FROM telep_1 GROUP BY telepulesnev HAVING distance <= ${km ? km : 0}) AS distances ON distances.telepulesnev = telepules`;

    return sssql;
};

const createIngatlanokSql = `
    CREATE TABLE IF NOT EXISTS eobgycvo_myhome.ingatlanok (
        id INT NOT NULL PRIMARY KEY,
        refid text DEFAULT NULL,
        office_id text DEFAULT NULL,
        cim text DEFAULT NULL,
        leiras text DEFAULT NULL,
        helyseg json DEFAULT NULL,
        irsz text DEFAULT NULL,
        telepules text DEFAULT NULL,
        kepek json DEFAULT NULL,
        ar text DEFAULT NULL,
        kaucio text DEFAULT NULL,
        penznem text DEFAULT NULL,
        statusz text DEFAULT NULL,
        tipus INT DEFAULT NULL,
        altipus text DEFAULT NULL,
        rendeltetes text DEFAULT NULL,
        allapot text DEFAULT NULL,
        emelet text DEFAULT NULL,
        alapterulet text DEFAULT NULL,
        telek text DEFAULT NULL,
        telektipus text DEFAULT NULL,
        beepithetoseg text DEFAULT NULL,
        viz text DEFAULT NULL,
        gaz text DEFAULT NULL,
        villany text DEFAULT NULL,
        szennyviz text DEFAULT NULL,
        szobaszam text DEFAULT NULL,
        felszobaszam text DEFAULT NULL,
        epitesmod text DEFAULT NULL,
        futes text DEFAULT NULL,
        isHirdetheto BOOLEAN,
        isKiemelt BOOLEAN,
        isErkely BOOLEAN,
        isLift BOOLEAN,
        isAktiv BOOLEAN,
        isUjEpitesu BOOLEAN,
        rogzitIdo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        hirdeto json DEFAULT NULL
    ) ENGINE=InnoDB;
`;

const createIngatlanokTriggerSql = `
CREATE TRIGGER IF NOT EXISTS trigger_refid
BEFORE INSERT
ON ingatlanok
FOR EACH ROW
IF (NEW.refid IS NULL) THEN
SELECT MAX(refid) INTO @max_refid
FROM ingatlanok
WHERE tipus = NEW.tipus;
IF (@max_refid IS NULL) THEN SET @refid = CASE NEW.tipus
WHEN '1' THEN 'hm-lk-'
WHEN '2' THEN 'hm-hz-'
WHEN '3' THEN 'hm-tk-'
WHEN '4' THEN 'hm-ir-'
WHEN '5' THEN 'hm-uz-'
WHEN '6' THEN 'hm-ip-'
WHEN '7' THEN 'hm-gz-'
WHEN '8' THEN 'hm-ta-'
WHEN '9' THEN 'hm-vh-'
WHEN '10' THEN 'hm-ft-'
WHEN '11' THEN 'hm-ih-'
WHEN '12' THEN 'hm-sh-'
WHEN '13' THEN 'hm-mg-'
ELSE 'UNKNOWN'
END;
SET NEW.refid = CONCAT(@refid, '000001'); 
ELSE SET NEW.refid = CONCAT(SUBSTR(@max_refid, 1, 6), LPAD(SUBSTR(@max_refid, 7) + 1, 6, '0')); 
END IF; 
END IF;
`;

export {
    pool,
    stringToBool,
    getId,
    getChangedField,
    renderValtozatasok,
    isObject,
    getDataFromDatabase,
    jwtparams,
    UseQuery,
    validateToken,
    hasRole,
    createIngatlanokSql,
    createIngatlanokTriggerSql,
    getIngatlanokByKm,
    getKepekForXml,
    getJSONfromLongtext,
    getBooleanFromNumber,
    getNumberFromBoolean,
    isTableExists,
    isAdminUsersTableExists
};
