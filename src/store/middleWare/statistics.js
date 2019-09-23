import axios from 'axios';
import * as actions from 'store/actions';

import { appMessage } from 'utils/Message';

export const getAddChartDataApi = (myChartState) => dispatch => {
    // export function getAddChartDataApi(myChartState) {
    //     return function (dispatch) {
    //     };
    // };
    // 같은 의미
    if (myChartState.get('scenarioData') !== '') {
        axios.post('/stat/cal', {
            nextState: myChartState.toJS()
        })
        .then(response => {
            console.log('response');
            console.log(response.data.nextState);
            dispatch(actions.addChartDataApi(response.data.nextState));
        })
        .catch(error => {
            alert(appMessage.apiErrorMessage);
        })
    } else {
        alert(appMessage.emptyInputData);
    };

};