import React from 'react';
import { Spinner } from 'reactstrap';
import PropTypes from 'prop-types';

const Loading = ({ isLoading }) => {
    return isLoading ? (
        <div className="loading">
            <div>
                <Spinner color="success" size="sm">
                    Loading...
                </Spinner>
            </div>
        </div>
    ) : (
        ''
    );
};

export default Loading;

Loading.propTypes = {
    isLoading: PropTypes.bool.isRequired
};
