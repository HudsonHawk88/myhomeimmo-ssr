const getDataFromDatabase = async (path, method, id, sql, datas, manipulateData) => {
    return new Promise((resolve, reject) => {
        if (method === 'POST' && method === 'PUT') {
            pool.query(sql, [datas], (error, result) => {
                if (!error) {
                    let data = resolve(result);
                    let newData;
                    if (manipulateData) {
                        newData = manipulateData(data);
                    } else {
                        newData = data;
                    }
                    return newData;
                } else {
                    return 'Hiba történt a lekérdezéskor, kérem próbálja újra!';
                }
            });
        } else {
            if (method === 'GET') {
                pool.query(sql, (error, result) => {
                    if (!error) {
                        let data = resolve(result);
                        let newData;
                        if (manipulateData) {
                            newData = manipulateData(data);
                        } else {
                            newData = data;
                        }
                        return newData;
                    } else {
                        return 'Hiba történt a lekérdezéskor, kérem próbálja újra!';
                    }
                });
            } else {
                pool.query(sql, (error, result) => {
                    if (!error) {
                        let data = resolve(result);
                        let newData;
                        if (manipulateData) {
                            newData = manipulateData(data);
                        } else {
                            newData = data;
                        }
                        return newData;
                    } else {
                        return 'Hiba történt a törlés közben, kérem próbálja újra!';
                    }
                });
            }
        }
    });
};

export default getDataFromDatabase;
