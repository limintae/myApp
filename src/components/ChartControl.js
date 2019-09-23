import React from 'react';
import PropTypes from 'prop-types';

import { Button, Icon, Input } from 'semantic-ui-react';

import * as utilFunction from 'utils/Function';

import './ChartControl.css';

const ChartControl = ({selectedTurnNumber, maxTurnNumber, nextChart, prevChart, addChart, onSave}) => {
    return (
        <div className="control-container">
            <div>
                <div className="turn-control-area">
                    <div className="btn-control">
                        <Button primary icon labelPosition='left'
                            onClick={prevChart}>
                            <Icon name='left arrow'/>
                            Prev
                        </Button>
                    </div>
                    <div className="center-value">
                        <b>{selectedTurnNumber} / {maxTurnNumber}</b>
                    </div>
                    <div className="btn-control">
                        <Button primary icon labelPosition='right'
                            onClick={nextChart}>
                            <Icon name='right arrow'/>
                            Next
                        </Button>
                    </div>
                </div>
                <div className="btn-load-area">
                    <Input placeholder='Search...'></Input>
                    <Button primary >LOAD</Button>
                </div>
                <div className="btn-save-area">
                    <Button primary onClick={addChart}>IMPORT</Button>
                    <Button primary onClick={onSave} >SAVE</Button>
                </div>
            </div>
        </div>
    );
};

ChartControl.propTypes = {
    turnNumber: PropTypes.number,
    nextChart: PropTypes.func,
    prevChart: PropTypes.func,
    addChart: PropTypes.func
};

ChartControl.defaultProps = {
    turnNumber: 0,
    nextChart: utilFunction.createWarning('onNext'),
    prevChart: utilFunction.createWarning('onPrev'),
    addChart: utilFunction.createWarning('addChart')
}

export default ChartControl;