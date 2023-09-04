import moment from 'moment';

const handleInputChange = (e, obj, setObj) => {
    /* if (!inputName) { */
    const { target } = e;
    const { type, checked, name } = target;
    const { pattern } = target;
    let value = target.value;
    if (type !== 'checkbox') {
        if (pattern && value) {
            if (value[value.length - 1].match(pattern)) {
                value = target.value;
            } else {
                value = value.slice(0, -1);
            }
        }
    } else {
        value = checked;
    }

    setObj({
        ...obj,
        [name]: value
    });
};

const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const addFile = async (e, obj, setObj) => {
    const { target } = e;
    const { name } = target;
    const file = target.files[0];
    let result = '';
    const filename = file.name;
    result = await toBase64(file);
    const value = {
        filename: filename,
        data: result
    };
    setObj({
        ...obj,
        [name]: value
    });
};

const recaptchaOnChange = (ref) => {
    ref.current.execute();
    // console.log(key);
};

export { handleInputChange, addFile, recaptchaOnChange };
