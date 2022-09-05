import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const Recaptcha = ({ innerRef, reCaptchaKey }) => {
    const onChange = (key) => {
        innerRef.current.reset();
    };

    return <ReCAPTCHA ref={innerRef} size="invisible" sitekey={reCaptchaKey} onChange={onChange} />;
};

export default Recaptcha;
