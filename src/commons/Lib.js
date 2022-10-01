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
    let formData = new FormData();

    for (var key in dataObj) {
        if (key === kepKey) {
            if (isMod) {
                dataObj.avatar.forEach((kep) => {
                    if (kep.file) {
                        formData.append(`uj_${kepKey}`, kep.file);
                    } else {
                        formData.append(kepKey, JSON.stringify(kep));
                    }
                });
            } else {
                dataObj[kepKey].forEach((kep) => {
                    if (kep.file) {
                        formData.append(kepKey, kep.file);
                    }
                });
            }
        } else if (isObject(dataObj[key])) {
            formData.append(key, JSON.stringify(dataObj[key]));
        } else {
            formData.append(key, dataObj[key]);
        }
    }

    return formData;
}

function arFormatter(ar) {
    /*   var inputElement = document.getElementById(id); */
    let newAr = ar + '';
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
}

export { hasRole, makeFormData, arFormatter };
