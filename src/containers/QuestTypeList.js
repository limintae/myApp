import React, { Component } from 'react';

import QuestType from '../components/QuestType';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import './QuestTypeList.css';

class QuestTypeList extends Component {
    // static defaultProps = {
    //     data: []
    // }

    componentDidMount() {
        
    }
    
    renderQuestTypeList = () => {
        const { questData, onSetList } = this.props;
        console.log(questData.toJS());
        return questData.map((item) => (
            // <SemanticList.Item>
            <QuestType 
                key={item.get('index')} 
                info={item}
                questType={item.get('questType')}
                questList={item.get('questList')}
                onSetList={onSetList}
             />
            // </SemanticList.Item>
        ))
    }

    render() {
        //const { data } = this.props;
        //console.log(`props data : ${data}`);
        // const list = data.map(info => (
        //     <QuestType key={info.id} info={info}/>
        //     // <div key={info.id}>
        //     //     <button><b>{info.id} : {info.questType}</b></button>
        //     // </div>
        //     )
        // );

        // const list = data.map((questList) => (
        //     <QuestType key={questList.get('id')} info={questList}/>
        // ));
        
        const { renderQuestTypeList } = this;

        return(
            // <SemanticList>
            <div className="quest-type-list-box">
                <ul>
                {renderQuestTypeList()}
                {/* <button onClick={this.props.onPlus}>+</button> */}
                </ul>
            </div>
            // </SemanticList>
        );
    }
}

const propTypes = {
    questData: PropTypes.instanceOf(List),
    onSetList: PropTypes.func,
    onPlus: PropTypes.func
};

function createWarning(funcName) {
    return () => console.warn(funcName + ' is not defined');
}

const defaultProps = {
    questData: List([]),
    onSetList: createWarning('onSetList'),
    onPlus: createWarning('onPlus')
};

QuestTypeList.propTypes = propTypes;
QuestTypeList.defaultProps = defaultProps;
 
export default QuestTypeList;