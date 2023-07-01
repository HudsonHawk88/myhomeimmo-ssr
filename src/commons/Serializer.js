import { initialValue, deserialize, serialize, getElementsFromHtml } from '@inftechsol/react-slate-wysiwyg';
import PropTypes from 'prop-types';

const serializeValue = (type, value) => {
    switch (type) {
        case 'de': {
            return deserialize(getElementsFromHtml(value));
        }
        case 'se': {
            const v = serialize(value);
            return v;
        }
        case 'def': {
            return initialValue;
        }
        default: {
            return initialValue;
        }
    }
};

export { initialValue, serializeValue };

serializeValue.propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired
};
