export const publicApis = [
    {
        path: '/ingatlan',
        id: req.query.id,
        sql: id
            ? `SELECT * FROM ingatlanok WHERE id='${id}' AND isAktiv='0'`
            : `SELECT id, refid, cim, leiras, helyseg, irsz, telepules, ar, kepek, kaucio, penznem, statusz, tipus, allapot, emelet, alapterulet, telek, telektipus, beepithetoseg, viz, gaz, villany, szennyviz, szobaszam, felszobaszam, epitesmod, futes, isHirdetheto, isKiemelt, isErkely, isLift, isAktiv, isUjEpitesu, rogzitoNev, rogzitoEmail, rogzitoTelefon, rogzitIdo FROM ingatlanok WHERE isAktiv='0';`,
        manipulateData: (data) => {
            data.forEach((ing) => {
                if (ing.kepek) {
                    ing.kepek = JSON.parse(ing.kepek);
                }
                if (ing.rogzitoAvatar) {
                    JSON.parse(ing.rogzitoAvatar);
                }
                if (ing.helyseg) {
                    ing.helyseg = JSON.parse(ing.helyseg);
                }

                ing.isHirdetheto = ing.isHirdetheto === 0 ? true : false;
                ing.isKiemelt = ing.isKiemelt === 0 ? true : false;
                ing.isErkely = ing.isErkely === 0 ? true : false;
                ing.isLift = ing.isLift === 0 ? true : false;
                ing.isAktiv = ing.isAktiv === 0 ? true : false;
                ing.isUjEpitesu = ing.isUjEpitesu === 0 ? true : false;
            });

            return data;
        }
    }
];
