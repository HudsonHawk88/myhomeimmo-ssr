import { createPool } from 'mysql2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
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

const poolConnect = (() => {
    /*   function _query(query, params, callback) {
      pool.connect((err, connection) => {
        if (err) {
            callback(null, err);
            throw err;
        } else {
          connection.query(query, params, (err, rows) => {
            connection.release();
            if (!err) {
                callback(rows);
            }
            else {
                callback(null, err);
            }
  
        });
  
        connection.on('error', (err) => {
            callback(null, err);
            throw err;
        });
        }
        
    });

  };
  console.log(db_params)
  console.log(_query)
  return {
      query: _query
  }; */
    return pool;
})();

function verifyJson(input) {
    try {
        JSON.parse(input);
    } catch (e) {
        return false;
    }
    return true;
}

const getJSONfromLongtext = (object) => {
    const keys = Object.keys(object);
    let newObj = {};
    keys.forEach((key) => {
        if (key === 'isHirdetheto' || key === 'isKiemelt' || key === 'isErkely' || key === 'isLift' || key === 'isAktiv' || key === 'isUjEpitesu') {
            console.log(newObj[key]);
            if (object[key] === 0 || object[key] === '0') {
                newObj[key] = false;
            } else {
                newObj[key] = true;
            }
        } else {
            verifyJson(object[key]) ? (newObj[key] = JSON.parse(object[key])) : (newObj[key] = object[key]);
        }
    });
    return newObj;

    /*    console.log('RESSSSSSSSSSSSS: ', res); */
    /*     let res = Object.entries(object).map(([key, value]) => {
        let result = null;
        console.log('KEYYYYYYYYY: ', key);
        console.log('VALUEEEEEEEEEE: ', value);
        if (key === 'isHirdetheto' || key === 'isKiemelt' || key === 'isErkely' || key === 'isLift' || key === 'isAktiv' || key === 'isUjEpitesu') {
            if (value === 0 || value === '0') {
                return (object[key] = object[key] = true);
            } else {
                return (object[key] = object[key] = false);
            }
        } else {
            return (object[key] = verifyJson(object[value]) ? JSON.parse(value) : value);
        }
    });


    console.log(res);

    return res; */
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

const getTypeForXml = (type) => {
    switch (type) {
        case 'Lakás': {
            return 1;
        }
        case 'Családi ház': {
            return 2;
        }
        case 'Telek': {
            return 3;
        }
        case 'Iroda': {
            return 4;
        }
        case 'Üzlethelyiség': {
            return 5;
        }
        case 'Ipari ingatlan': {
            return 6;
        }
        case 'Garázs': {
            return 7;
        }
        case 'Vendéglátó hely': {
            return 9;
        }
        case 'Fejlesztési terület': {
            return 10;
        }
        case 'Irodaház': {
            return 11;
        }
        case 'Szálláshely': {
            return 12;
        }
        case 'Mezőgazdasági terület': {
            return 13;
        }
        default: {
            return 2;
        }
    }
};

const getAllapotForXml = (allapot, tipus) => {
    if (
        tipus === 'Lakás' ||
        tipus === 'Családi ház' ||
        tipus === 'Vendéglátóhely' ||
        tipus === 'Szálláshely' ||
        tipus === 'Iroda' ||
        tipus === 'Sorház' ||
        tipus === 'Üzlethelyiség' ||
        tipus === 'Hétvégi ház/Nyaraló'
    ) {
        switch (allapot) {
            case 'Átlagos': {
                return `<property-condition>3 - Lakható</property-condition>`;
            }
            case 'Felújítandó': {
                return `<property-condition>2 - Felújítandó</property-condition>`;
            }
            case 'Jó': {
                return `<property-condition>4 - Jó</property-condition>`;
            }
            case 'Kiváló': {
                return `<property-condition>5 - Nagyon jó</property-condition>`;
            }
            case 'Új': {
                return `<property-condition>Új ép.</property-condition>`;
            }
            default: {
                return `<property-condition>3 - Lakható</property-condition>`;
            }
        }
    } else return '';
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

const UseQuery = async (pool, sql) => {
    return new Promise((data) => {
        // console.log(pool)
        pool.query(sql, function (error, result, ff) {
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

    /*   let result = await pool.query(sql, function (error, result, ff) {
    // change db->connection for your code
    if (error) {
      // console.log(error);
      throw error;
    }
    try {
      return result;
    } catch (error) {
      return [];
    }
  });
  return await result; */
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
            roles: result.roles,
            email: result.email,
            avatar: result.avatar
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

const getTelepulesekByKm = async (pool, telepules, irszam, km) => {
    const getCoordinatesSql = irszam ? `SELECT geoLong, geoLat FROM telep_1 WHERE irszam='${irszam}'` : `SELECT geoLong, geoLat FROM telep_1 WHERE telepulesnev='${telepules}'`;
    const coordinates = await UseQuery(pool, getCoordinatesSql);
    const sql = `
  SELECT telepulesnev, ROUND((6371 * acos(cos(radians(${coordinates[0].geoLat})) * cos(radians(geoLat)) * cos(radians(geoLong) - radians(${coordinates[0].geoLong})) + sin(radians(${coordinates[0].geoLat})) * sin(radians(geoLat)))), (2)), id 
  AS distance
  FROM telep_1
  GROUP BY telepulesnev
  HAVING distance < '${km}'
  ORDER BY distance;`;
    const nearTelepulesek = await UseQuery(pool, sql);

    return nearTelepulesek;
};

const createIngatlanokSql = `
    CREATE TABLE IF NOT EXISTS eobgycvo_myhome.ingatlanok (
        id INT NOT NULL PRIMARY KEY,
        refid text DEFAULT NULL,
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
        altipus INT DEFAULT NULL,
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

const uploadFile = (files, upload) => {
    // upload(req, res, function (err) {
    //     if (err instanceof multer.MulterError) {
    //       console.log(err)
    //         // A Multer error occurred when uploading.
    //     } else if (err) {
    //       console.log(err)
    //         // An unknown error occurred when uploading.
    //     }
    //     console.log(files)
    //     // Everything went fine.
    //     next()
    // })
};

export {
    poolConnect,
    getDataFromDatabase,
    jwtparams,
    UseQuery,
    validateToken,
    hasRole,
    createIngatlanokSql,
    createIngatlanokTriggerSql,
    getTelepulesekByKm,
    uploadFile,
    getTypeForXml,
    getAllapotForXml,
    getKepekForXml,
    getJSONfromLongtext,
    getBooleanFromNumber,
    getNumberFromBoolean
};

/* exports.poolConnect = poolConnect;
exports.jwtparams = jwtparams;
exports.UseQuery = UseQuery;
exports.validateToken = validateToken;
exports.hasRole = hasRole;
exports.createIngatlanokSql = createIngatlanokSql;
exports.createIngatlanokTriggerSql = createIngatlanokTriggerSql;
exports.getTelepulesekByKm = getTelepulesekByKm;
exports.uploadFile = uploadFile;
exports.getTypeForXml = getTypeForXml;
exports.getAllapotForXml = getAllapotForXml;
exports.getKepekForXml = getKepekForXml; */
