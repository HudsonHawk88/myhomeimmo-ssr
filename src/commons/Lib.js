const hasRole = (userRoles, minRoles) => {
    let result = false;
    userRoles &&
        userRoles.forEach((userrole) => {
            if (minRoles.includes(userrole.value)) {
                result = true;
            }
        });

    return result;
};

export { hasRole };
