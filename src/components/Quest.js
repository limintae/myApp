//use functional type component
import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';

//import { Container, Item, Button } from 'semantic-ui-react';
import './Quest.css';

// function runQuestUrl(questUrl) {
//     //console.log(questUrl);
//     document.location.href=questUrl;
// }

const Quest = ({ questType, data }) => {

    //const { questId ,questName, questUrl, imgSrc } = data;

    const runQuestUrl = (questUrl) => {
        //console.log(questUrl);
        document.location.href=questUrl;
    }

    return (
        <div className="quest-contents" onClick={() => runQuestUrl(data.get('questUrl'))}>
            <div className="quest-thumb">
                <img className="img-quest" src={ data.get('imgSrc') } alt={data.get('questName')}></img>
            </div>
            <div className="quest-dec">
                <div className="quest-dec2">Lv{data.get('questLv')} {data.get('questName')}</div>
                {/* <div className="quest-name">{data.get('questName')}</div> */}
                {/* <div>{data.get('questId')} {data.get('questName')} {data.get('questUrl')} {data.get('imgSrc')}</div> */}
            </div>
        </div>
        
        // <Item style={{margin: '0rem 0'}}>
        //     <Item.Image size='small' src={ data.get('imgSrc') }/>
        //     <Item.Content verticalAlign='middle'>
        //         <div className="quest-name">{data.get('questName')}</div>
        //     </Item.Content>
        // </Item>
    );
};

Quest.propTypes = {
    questType: PropTypes.string,
    data: PropTypes.instanceOf(Map)
};

Quest.defaultProps = {
    questType: '',
    data: Map({})
};

export default Quest;

