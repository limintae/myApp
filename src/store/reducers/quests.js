import * as types from '../actions/ActionTypes';
import { Map, List } from 'immutable';

const initialState = Map({
    questData: Map({}),
    number: 0,
    questType: 'undefined',
    questList: List([])
    // questList: List([
    //     Map({
    //         questId: 0,
    //         questName: 'undefined',
    //         questUrl: 'undefined'
    //     })
    // ])
})

export default function quests(state = initialState, action) {
    //전달 받은 액션에 따라서 .....
    //console.log('state : ' + state);
    //const { number, questType, questList } = state;
    //console.log('action');
    switch(action.type) {
        case types.SET_LIST:
            // const tmpData = data.get('questTypeList').filter(item => item.get('questType') === 'hard');
            // console.log(tmpData.get(0).get('questList').toJS());
            // console.log(action.questType);

             
            // console.log(action.questList.toJS());
            // console.log(action.questType);
            // console.log('action : SET_LIST');
            //state.set('questType', action.questType);
            //const tmp = state.set('questType', 'ddd');
            //const tmp2 = state.update('questType', value => 'sss');
            // console.log(tmp.get('questType'));
            // console.log(tmp2.get('questType'));
            //console.log(state.get('questType'));

            let nextState = state.set('questType', action.questType);
            nextState = nextState.update('questList', value => action.questList);
            //console.log(nextState.get('questType'));
            //console.log(nextState.get('questList').toJS());
            return nextState;
        case types.INCREMENT:
            return state.set('number', state.get('number') + 1)
        default:
            return state
    }
}