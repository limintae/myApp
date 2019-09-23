import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactHighcharts from 'react-highcharts';

class ChartSingle extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        const { chartConfigData } = this.props;

        return (
            <div>
                <ReactHighcharts config={chartConfigData}></ReactHighcharts>
            </div>
        )
    }
}

const propTypes = {
    chartData: PropTypes.object
};

const defaultProps = {
    chartData: {}
};

ChartSingle.propTypes = propTypes;
ChartSingle.defaultProps = defaultProps;

export default ChartSingle;