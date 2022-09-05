import PropTypes from 'prop-types';

export const serializeValue = (type, obj, setObj, name, callback) => {
    const defaultWysiwygValue = '<p align="left" style="font-size:17px"></p>';
    if (__isBrowser__) {
        let imp = new Promise((resolve, reject) => {
            resolve(import('@organw/wysiwyg-editor').then((ser) => ser.serializer));
        });
        imp.then((serial) => {
            switch (type) {
                case 'de': {
                    setObj({
                        ...obj,
                        [name]: serial.deserialize(obj[name])
                    });
                    return;
                }
                case 'se': {
                    let kuldObj = {
                        ...obj,
                        [name]: serial.serialize(obj[name])
                    };
                    callback(kuldObj);
                    return;
                }
                case 'def': {
                    setObj({
                        ...obj,
                        [name]: serial.deserialize(defaultWysiwygValue)
                    });
                    return;
                }
                default: {
                    setObj({
                        ...obj,
                        [name]: serial.deserialize(defaultWysiwygValue)
                    });
                    return;
                }
            }
        });
    }
};

serializeValue.propTypes = {
    type: PropTypes.string.isRequired,
    obj: PropTypes.object.isRequired,
    setObj: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    callback: PropTypes.func
};
