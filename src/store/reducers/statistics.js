import * as types from '../actions/ActionTypes';
import { Map, List, fromJS } from 'immutable';
import * as utilFunction from 'utils/Function';

const initialState = Map({
    openPortal: false,
    selectedTurnNumber: 0,
    turnNumber: 0,
    scenarioData: '',
    turnData: List([
        Map({
            turnNumber: 0,
            attackFlag: false,
            data: List([])
        })
    ]),
    chartConfigTurn: {
        title: {
            text: 'TURN 0'
        }
    },
    chartConfigTotal: {
        title: {
            text: 'TOTAL'
        }
    },
    chartConfigFlow: {
        title: {
            text: 'FLOW'
        }
    }
})

export default function statistics(state = initialState, action) {
    let nextState = state;
    switch(action.type) {
        case types.SAVE_STAT:
            return nextState
        case types.LOAD_STAT:
            return nextState
        case types.OPEN_PORTAL:
            return nextState.set('openPortal', action.openValue)
        case types.SET_DATA_VALUE:
            nextState = nextState.set('scenarioData', action.scenarioData);
            return nextState
            //return state.set('scenarioData', action.scenarioData);
        case types.NEXT_CHART:
            const maxTurnNumber = nextState.get('turnNumber');

            if (nextState.get('selectedTurnNumber') + 1 <= maxTurnNumber) {
                nextState = nextState.set('selectedTurnNumber', nextState.get('selectedTurnNumber') + 1);
                nextState = nextState.set('chartConfigTurn', createChartConfigTurn(nextState.get('turnData'), nextState.get('selectedTurnNumber')));
            }
            return nextState
        case types.PREV_CHART:
            const minTurnNumber = 1;    

            if (nextState.get('selectedTurnNumber') - 1 >= minTurnNumber) {
                nextState = nextState.set('selectedTurnNumber', nextState.get('selectedTurnNumber') - 1);
                nextState = nextState.set('chartConfigTurn', createChartConfigTurn(nextState.get('turnData'), nextState.get('selectedTurnNumber')));
            }

            return nextState
        case types.ADD_CHART_DATA_API:
            nextState = fromJS(action.apiState);
            nextState = nextState.set('chartConfigTurn', createChartConfigTurn(nextState.get('turnData'), nextState.get('selectedTurnNumber')));
            nextState = nextState.set('chartConfigTotal', createChartConfigTotal(nextState.get('turnData')));
            nextState = nextState.set('chartConfigFlow', createChartConfigFlow(nextState.get('turnData')));
            return nextState
        case types.ADD_CHART_DATA: 
            nextState = addChartData(state, nextState);
            return nextState
        default:
            return state 
    };
};

const createChartConfigTurn = (chartData, selectedTurnNumber) => {

    let selectedChartData = chartData.filter(item => item.get('turnNumber') === selectedTurnNumber).getIn([0, 'data']);
    let data = List([]);
    selectedChartData.forEach((item, index) => {
        
        const tmpMap = Map({
            pos: item.get('pos'),
            name: item.get('name'),
            type: item.get('type'),
            color: utilFunction.setChartColorByType(item.get('type')),
            y: item.get('normal') + item.get('ability'),
            normal: item.get('normal'),
            ability: item.get('ability'),
            attackCount: item.get('attackCount')
        })
        data = data.push(tmpMap);
    })
    const config = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'TURN ' + selectedTurnNumber
        },
        subtitle: {
            // text: 'subtitle'
        },
        xAxis: {
            type: 'chara',
            categories: ['player', 'npc1', 'npc2', 'npc3', 'chanburst & extra']
        },
        yAxis: {
            title: {
                text: 'damege'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                animation: {
                    duration: 500
                },
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    // format: '{point.y:.1f}%'
                    format: '{point.y:.f}'
                }
            }
        },
        tooltip: {
            formatter: function() {
                let formatter = '';
                formatter += `<span style="font-weight: bold;font-size:11px;color:${this.point.color}">${this.x}</span><br>`;
                formatter += `<span style="font-weight: bold;">total</span>: ${this.point.y}<br/>`;
                formatter += `<span style="font-weight: bold;">normal</span>: ${this.point.normal}<br/>`;
                formatter += `<span style="font-weight: bold;">ability</span>: ${this.point.ability}<br/>`;
                formatter += `<span style="font-weight: bold;">Type</span>: ${this.point.type}<br/>`;
                formatter += `<span style="font-weight: bold;">attackCount</span>: ${this.point.attackCount}<br/>`;
                return formatter;
            }
        },
        series: [{
            name: 'damege',
            colorByPoint: true,
            data: data.toJS()
        }]
      };

      return config
}

const createChartConfigFlow = (chartData) => {
    let series = List([]);
    let seriesObjTotal = Map({
        pos: 4,
        name: 'total',
        data: List([])
    })
    let xAxisCategories = List([]);
    chartData.forEach((item, index) => {
        if (index === 0) { return };
        let turnNumber = index;
        xAxisCategories = xAxisCategories.push(turnNumber);
        seriesObjTotal = seriesObjTotal.set('data', seriesObjTotal.get('data').push(0));
        item.get('data').forEach((itemInner, index) => {
            let damage = itemInner.get('normal') + itemInner.get('ability');

            let totalDamage = seriesObjTotal.getIn(['data', turnNumber - 1]) + damage;
            seriesObjTotal = seriesObjTotal.setIn(['data', turnNumber - 1], totalDamage);
            if (series.filter(item => item.get('pos') === itemInner.get('pos')).size === 0) {
                //pos값이 없을경우 list에 추가
                const seriesObj = Map({
                    index: itemInner.get('index'),
                    pos: itemInner.get('pos'),
                    name: itemInner.get('name'),
                    data: List([damage])
                })
                series = series.push(seriesObj);
            } else {
                //pos값이 있을경우 업데이트
                let damageDataList = series.getIn([itemInner.get('pos'), 'data']);
                damageDataList = damageDataList.push(damage);
                series = series.setIn([itemInner.get('pos'), 'data'], damageDataList);
            }
        })
    })
    series = series.push(seriesObjTotal);
    const config = {
        chart: {
            type: 'line'
        },
        title: {
            text: 'FLOW'
        },  
        subtitle: {
            // text: 'subtitle'
        },
        xAxis: {
            type: 'TURN',
            categories: xAxisCategories.toJS()
        },
        yAxis: {
            title: {
                text: 'damege'
            }
        },
        legend: {
            enabled: true,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        plotOptions: {
            series: {
                animation: {
                    duration: 500
                },
                borderWidth: 0,
                dataLabels: {
                    enabled: false,
                    // format: '{point.y:.1f}%'
                    format: '{point.y}'
                }
            }
        },
        tooltip: {
            formatter: function() {
                let formatter = '';
                formatter += `<span style="font-weight: bold;font-size:11px;color:${this.point.color}">${this.series.name}</span><br>`;
                formatter += `<span style="font-weight: bold;">Damage</span>: ${this.point.y}<br/>`;
                return formatter;
            }
        },
        series: series.toJS()
      };

      return config
}

const createChartConfigTotal = (chartData) => {
    let data = List([]);
    chartData.forEach((item, index) => {
        if (index === 0) { return };
        
        item.get('data').forEach((itemInner, index) => {
            if (data.filter(item => item.get('pos') === itemInner.get('pos')).size === 0) {
                //pos값이 없을경우 list에 추가
                const tmpMap = Map({
                    pos: itemInner.get('pos'),
                    name: itemInner.get('name'),
                    // color: '#4b79a5',
                    color: utilFunction.setChartTotalColorByType(itemInner.get('type')),
                    y: itemInner.get('normal') + itemInner.get('ability')
                })
                data = data.push(tmpMap);
            } else {
                //pos값이 있을경우 업데이트
                let damage = data.getIn([itemInner.get('pos'), 'y']) + itemInner.get('normal') + itemInner.get('ability');
                data = data.setIn([itemInner.get('pos'), 'y'], damage);
            }
        })
    })

    const config = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'TOTAL'
        },
        subtitle: {
            // text: 'subtitle'
        },
        xAxis: {
            type: 'chara',
            categories: ['player', 'npc1', 'npc2', 'npc3', 'chanburst & extra']
        },
        yAxis: {
            title: {
                text: 'damege'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                animation: {
                    duration: 500
                },
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    // format: '{point.y:.1f}%'
                    format: '{point.y}'
                }
            }
        },
        tooltip: {
            // headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            // headerFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
            // pointFormat: function() = {
            //     let pointFormat = '';
            //     // pointFormat += '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>';
            //     // pointFormat += '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>';
            //     return pointFormat;
            // }
            formatter: function() {
                let formatter = '';
                formatter += `<span style="font-weight: bold;font-size:11px;color:${this.point.color}">${this.x}</span><br>`;
                formatter += `<span style="font-weight: bold;">Damage</span>: ${this.point.y}<br/>`;
                return formatter;
            }
        },
        series: [{
            name: 'damege',
            colorByPoint: true,
            data: data.toJS()
        }]
      };

      return config
}


const addChartData = (state, nextState) => {
    const chanburstPos = 4;
    let chartData = List([
        Map({
            index: 0,
            pos: 0,
            name: 'player',
            type: '',
            y: 0,
            normal: 0,
            ability: 0
        }),
        Map({
            index: 1,
            pos: 1,
            name: 'npc1',
            type: '',
            y: 0,
            normal: 0,
            ability: 0
        }),
        Map({
            index: 2,
            pos: 2,
            name: 'npc2',
            type: '',
            y: 0,
            normal: 0,
            ability: 0
        }),
        Map({
            index: 3,
            pos: 3,
            name: 'npc3',
            type: '',
            y: 0,
            normal: 0,
            ability: 0
        }),
        Map({
            index: 4,
            pos: chanburstPos,
            name: 'chanburst',
            type: '',
            y: 0,
            normal: 0,
            ability: 0
        })
    ]);

    let defaultTurnData = Map({
        attackFlag: false,
        turnNumber: 0,
        data: chartData
    });

    try {
        let responseData = JSON.parse(nextState.get('scenarioData'));
        //immutable List
        const scenarioObj = fromJS(responseData.scenario);
        const statusObj = fromJS(responseData.status);
        let currTurnNumber;
        
        let attackData;
        let resultType;
        let currTurnData;
        if (scenarioObj.getIn([0, 'cmd']) === 'ability') {
            attackData = scenarioObj.filter(item => (item.get('cmd') === 'attack' && item.get('from') === 'player')
                                        || item.get('cmd') === 'ability'
                                        || (item.get('cmd') === 'damage' && item.get('to') === 'boss')
                                        || (item.get('cmd') === 'loop_damage' && item.get('to') === 'boss'));
            resultType = 'ability';
            currTurnNumber = statusObj.get('turn');
        } else {
            attackData = scenarioObj.filter(item => (item.get('cmd') === 'attack' && item.get('from') === 'player')
                                        || item.get('cmd') === 'special' 
                                        || item.get('cmd') === 'special_npc'
                                        || (item.get('cmd') === 'damage' && item.get('to') === 'boss')
                                        || (item.get('cmd') === 'loop_damage' && item.get('to') === 'boss')
                                        || item.get('cmd') === 'chain_cutin'
                                        || item.get('cmd') === 'turn');
            resultType = 'normal';
            currTurnNumber = statusObj.get('turn') - 1;
        }
        currTurnData = nextState.getIn(['turnData', currTurnNumber]);
        
        if (resultType === 'normal') {

            // 오의 추가타는 이전 position캐릭터의 pos값을 사용
            let prevPos;
            let chanburstFlag = false;
            let turnFlag = false;
            attackData.forEach((item, index) => {
                let damage = 0;
                let itemPos;
                let type; //공격 타입
                itemPos = item.get('pos');

                // Damage calculation
                if (item.get('cmd') === 'attack') {
                    type = 'attack';
                    item.get('damage').forEach((itemDept1, index) => {
                        itemDept1.forEach((itemDept2, indexDept2) => {
                            damage += itemDept2.get('value');
                        });
                    });
                } else if (item.get('cmd') === 'special' || item.get('cmd') === 'special_npc') {
                    type = 'special';
                    if (item.get('total') !== undefined) { //오의 데미지가 없는 오의 시전의 경우 처리
                        item.get('total').forEach((itemInner, index) => {
                            //split 배열로 구성된 데이터를 total 변수에 할당
                            let total = '';
                            itemInner.get('split').forEach((spcialData, index) => {
                                total += spcialData;
                            });
                            damage += Number.parseInt(total, 10);
                        })
                    }
                } else if (item.get('cmd') === 'damage' || item.get('cmd') === 'loop_damage') { //체인버스트, 오의 추가타 등

                    if (chanburstFlag) {
                        itemPos = chanburstPos;
                        type = 'chanburst';
                    } else if (turnFlag) {
                        itemPos = chanburstPos;
                        type = 'extra';
                    } else {
                        itemPos = prevPos;
                        type = 'none';
                    }

                    let damageArrName;
                    if (item.get('cmd') === 'loop_damage') {
                        damageArrName = 'total';
                    } else if (item.get('cmd') === 'damage') {
                        damageArrName = 'list'
                    };

                    if (damageArrName !== undefined) {
                        item.get(damageArrName).forEach((itemInner, index) => {
                            let total = '';
                            itemInner.get('split').forEach((spcialData, index) => {
                                total += spcialData;
                            });
                            damage += Number.parseInt(total, 10);
                        })        
                    } else {
                        console.log('error!');
                    }
                } else if (item.get('cmd') === 'chain_cutin') {
                    chanburstFlag = true;
                    return;
                } else if (item.get('cmd') === 'turn') {
                    turnFlag = true;
                    return;
                }

                // Create chartData
                // if (chartData.filter(item => item.get('pos') === itemPos).toJS().length !== 0) { 
                    //chartData의 해당 pos에 데미지 가산
                    let posData = chartData.filter(item => item.get('pos') === itemPos).get(0);
                    let posIndex = posData.get('index');
                    damage = posData.get('normal') + damage;
                    chartData = chartData.setIn([posIndex, 'normal'], damage);
                    if (type !== 'none') {
                        chartData = chartData.setIn([posIndex, 'type'], type);
                    }
                // }
                prevPos = itemPos;
            })
            
            //신규추가턴인 경우 
            if (currTurnData === undefined) {
                let insertTurnData = defaultTurnData
                                    .set('attackFlag', true)
                                    .set('turnNumber', currTurnNumber)
                                    .set('data', chartData);

                nextState = nextState.update('turnData', value => value.set(currTurnNumber, insertTurnData));
                nextState = nextState.set('turnNumber', currTurnNumber);
                nextState = nextState.set('selectedTurnNumber', nextState.get('turnNumber'))

            } else {
                if (currTurnData.get('attackFlag') === false) {
                    let nextTurnData = nextState.getIn(['turnData', currTurnNumber]);
                    nextTurnData = nextTurnData.set('attackFlag', true);
                    chartData.forEach((item, index) => {
                        let nextNormalDamage = nextTurnData.getIn(['data', item.get('index'), 'normal']) + item.get('normal');
                        let nextType = item.get('type');

                        nextTurnData = nextTurnData.setIn(['data', item.get('index'), 'normal'], nextNormalDamage);
                        nextTurnData = nextTurnData.setIn(['data', item.get('index'), 'type'], nextType);
                    });
                    nextState = nextState.update('turnData', value => value.set(currTurnNumber, nextTurnData));
                    nextState = nextState.set('selectedTurnNumber', currTurnNumber);
                }
            }
        } else if (resultType === 'ability') {
            let abilityPos; // ability 시전자 pos 
            let abilityDamage = 0; // 계산된 ability damage 

            //ability pos, damage계산
            attackData.forEach((item, index) => {
                if (index === 0 && item.get('cmd') === 'ability') {
                    //get ability chara position
                    abilityPos = item.get('pos');
                } else if (item.get('cmd') === 'attack') {
                    item.get('damage').forEach((itemDept1, index) => {
                        itemDept1.forEach((itemDept2, indexDept2) => {
                            abilityDamage += itemDept2.get('value');
                        });
                    });
                } else if (item.get('cmd') === 'damage' || item.get('cmd') === 'loop_damage') {

                    let damageArrName;
                    if (item.get('cmd') === 'loop_damage') {
                        damageArrName = 'total';
                    } else if (item.get('cmd') === 'damage') {
                        damageArrName = 'list'
                    };

                    if (damageArrName !== undefined) {
                        item.get(damageArrName).forEach((itemInner, index) => {
                            let total = '';
                            itemInner.get('split').forEach((spcialData, index) => {
                                total += spcialData;
                            });
                            abilityDamage += Number.parseInt(total, 10);
                        })        
                    } else {
                        console.log('damageArrName undefined!');
                    }
                }
            });

            // 계산된 데이터를 state에 세팅
            let insertTurnData = defaultTurnData.set('turnNumber', currTurnNumber);
            let tmpMap = insertTurnData.get('data').filter(item => item.get('pos') === abilityPos).get(0);
            let tmpPosIndex = tmpMap.get('index');
            const type = 'ability';
            if (currTurnData === undefined) {
                tmpMap = tmpMap.update(type, value => value + abilityDamage);
                insertTurnData = insertTurnData.setIn(['data', tmpPosIndex], tmpMap);
                
                nextState = nextState.update('turnData', value => value.set(currTurnNumber, insertTurnData));
                nextState = nextState.set('turnNumber', currTurnNumber);
                nextState = nextState.set('selectedTurnNumber', currTurnNumber);
            } else {
                abilityDamage = abilityDamage + state.getIn(['turnData', currTurnNumber, 'data', tmpPosIndex, type]);
                nextState = nextState.setIn(['turnData', currTurnNumber, 'data', abilityPos, type], abilityDamage);
                nextState = nextState.set('selectedTurnNumber', currTurnNumber);
            }
        }
        
        // undefined 턴이 있는 경우 default값으로 채워준다
        nextState = nextState.set('scenarioData', '');
        nextState.get('turnData').forEach((item, index) => {
            if (item === undefined) {
                let insertDefaultTurnData = defaultTurnData.set('turnNumber', index);
                nextState = nextState.setIn(['turnData', index], insertDefaultTurnData);
            }
        });

    } catch (e) {
        nextState = state;
    };

    return nextState;
}