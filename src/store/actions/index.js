import * as types from './ActionTypes';

export function setList(questList, questType) {
    return {
        type: types.SET_LIST,
        questList,
        questType
    }
};

export function increment() {
    return {
        type: types.INCREMENT
    }
}

export function addChartData() {
    return {
        type: types.ADD_CHART_DATA
    }
}

export function addChartDataApi(apiState) {
    return {
        type: types.ADD_CHART_DATA_API,
        apiState
    }
}

export function setDataValue(scenarioData) {
    return {
        type: types.SET_DATA_VALUE,
        scenarioData 
    }
}

export function nextChart() {
    return {
        type: types.NEXT_CHART
    }
}

export function prevChart() {
    return {
        type: types.PREV_CHART
    }
}

export function saveStat() {
    return {
        type: types.SAVE_STAT
    }
}

export function loadStat() {
    return {
        type: types.LOAD_STAT
    }
}

export function openPortal(openValue) {
    return {
        type: types.OPEN_PORTAL,
        openValue
    }
}
