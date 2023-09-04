import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

const Stepper = ({ children, className, buttonContainerClassName, leirasClassName, buttonClassName, step, setStep, stepperStyle = { color: 'primary' }, stepsArray }) => {
    const isActiveStep = (stepNumber) => {
        let result = true;

        if (stepNumber === step) {
            result = false;
        }

        return result;
    };

    const renderStepperButton = () => {
        return (
            Array.isArray(stepsArray) &&
            stepsArray.length > 0 &&
            stepsArray.map((item, index) => {
                let id = index + 1;
                return (
                    <div className={`pagebutton_container ${buttonContainerClassName ? buttonContainerClassName : ''}`} key={'stepButton_' + id}>
                        <Button color={stepperStyle.color} className={`page ${buttonClassName}`} outline={isActiveStep(id)} onClick={() => setStep(id)}>
                            {item.content ? item.content : id}
                        </Button>

                        <span className={`pagebutton_leiras ${leirasClassName ? leirasClassName : ''}`}>{item.leiras}</span>
                    </div>
                );
            })
        );
    };

    return (
        <React.Fragment>
            <div className={`stepper ${className ? className : ''}`}>{renderStepperButton()}</div>
        </React.Fragment>
    );
};

Stepper.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    buttonContainerClassName: PropTypes.string,
    leirasClassName: PropTypes.string,
    buttonClassName: PropTypes.string,
    step: PropTypes.number.isRequired,
    setStep: PropTypes.func.isRequired,
    stepperStyle: PropTypes.object,
    stepsArray: PropTypes.array.isRequired
};

export default Stepper;
