//use functional type component
import React from 'react';

import Quest from '../components/Quest';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import './QuestList.css';

const QuestList = ({ questType, questList }) => {
    
    const questListRender = questList.map(
        (quest, i) => (
            // <li>
                <Quest  
                    key={i} 
                    questType={questType} 
                    data={quest} 
                />
            // </li>
            // <Quest  
            //     key={i} 
            //     questType={questType} 
            //     data={quest} 
            // />
        )
    );

    return (
        <div className="quest-list-box">
            {/* <ul> */}
                {questListRender}
            {/* </ul> */}
            {/* <Item.Group>
                {questListRender}
            </Item.Group> */}
        </div>
    );
}

QuestList.propTypes = {
    questType: PropTypes.string,
    questList: PropTypes.instanceOf(List)
}

QuestList.defaultProps = {
    questType: '',
    questList: List([])
}

export default QuestList;

