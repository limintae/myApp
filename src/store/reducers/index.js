//reducer integration
import { combineReducers } from 'redux';
import quests from 'store/reducers/quests';
import statistics from 'store/reducers/statistics';

const reducers = combineReducers({
    quests, statistics
});

export default reducers;