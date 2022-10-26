function hasRole(userRoles, minRoles) {
    let result = false;
    userRoles &&
        userRoles.forEach((userrole) => {
            if (minRoles.includes(userrole.value)) {
                result = true;
            }
        });

    return result;
}

function isObject(input) {
    if (Array.isArray(input) || input === Object(input)) {
        return true;
    } else {
        return false;
    }
}

function makeFormData(dataObj, kepKey, isMod) {
    let data = new FormData();
    for (var key in dataObj) {
        if (key === kepKey) {
            if (isMod) {
                dataObj[kepKey].forEach((kep) => {
                    if (kep.file) {
                        data.append(`uj_${kepKey}`, kep.file);
                    } else {
                        data.append(kepKey, JSON.stringify(kep));
                    }
                });
            } else {
                dataObj[kepKey].forEach((kep) => {
                    if (kep.file) {
                        data.append(kepKey, kep.file);
                    }
                });
            }
        } else if (isObject(dataObj[key])) {
            data.append(key, JSON.stringify(dataObj[key]));
        } else {
            data.append(key, dataObj[key]);
        }
    }
    /*     console.log('FormData: ', data.getAll('leiras')); */
    return data;
}

function arFormatter(ar) {
    /*   var inputElement = document.getElementById(id); */
    let a = ar + '';
    const regexp = new RegExp('[0-9 ]+');
    console.log(a.length > 0 && a[a.length - 1].match(regexp));
    if (a.length > 0 && a[a.length - 1].match(regexp)) {
        let newAr = a;
        newAr = newAr.replace(/\D/g, '');
        newAr = newAr.replace(' ', '').split('').reverse().join(''); // reverse
        if (newAr.length > 0) {
            var newValue = '';
            for (var i = 0; i < newAr.length; i++) {
                if (i % 3 === 0 && i > 0) {
                    newValue += ' ';
                }
                newValue += newAr[i];
            }
            newValue = newValue.split('').reverse().join('');
            return newValue;
        }
    } else {
        a = a.slice(0, -1);
    }
    return a;
}

export { hasRole, makeFormData, arFormatter };
