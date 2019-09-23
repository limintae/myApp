import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';

import './QuestType.css';
class QuestType extends Component {

    render() {
        const { info, questType, questList, onSetList } = this.props;
        return (
            <li>
                <div className='quest-type' onClick={() => onSetList(questList, questType)}>
                    <div className='item'>{info.get('questType')}</div>
                    {/* <Button onClick={() => onSetList(questList, questType)}><b>{info.get('index')} : {info.get('questType')}</b></Button> */}
                </div>
            </li>
        );
    }
}

function createWarning(funcName) {
    return () => console.warn(funcName + ' is not defined');
}

QuestType.propTypes = {
    info: PropTypes.instanceOf(Map),
    questType: PropTypes.string,
    questList: PropTypes.instanceOf(List),
    onSetList: PropTypes.func
};
QuestType.defaultProps = {
    info: Map({}),
    questType: '',
    questList: List([]),
    onSetList: createWarning('onSetList')
};

export default QuestType;