import React, { Component } from 'react'
import { connect } from 'react-redux';
import { List, Map } from 'immutable';

import * as actions from 'store/actions';
import ChartSingle from 'components/ChartSingle';
import Chart from  'components/Chart';
import ChartTotal from  'components/ChartTotal';
import ChartControl from 'components/ChartControl';
import ChartFlow from 'components/ChartFlow';

import { appMessage } from 'utils/Message';
 
//semantic-ui
import './Statistics.css';
import { Grid, TextArea, Form, Divider, Input } from 'semantic-ui-react'

import * as middleWare from 'store/middleWare/statistics'; // import reducers/index.js

class Statistics extends Component {
    
    constructor(props) {
        super(props);

        this._handleChangeFn = this._handleChange.bind(this);
        this._calChartDataFn = this._calChartData.bind(this);

        this._postTestFn = this._postTest.bind(this);
        this._handleSubmitFn = this._handleSubmit.bind(this);

    };

    _postTest = () => {
    }
    
    _calChartData = () => {
        const myChartState = Map({
            selectedTurnNumber: this.props.selectedTurnNumber,
            turnNumber: this.props.turnNumber,
            scenarioData: this.props.scenarioData,
            turnData: this.props.turnData
        })

        this.props.handleAddChartDataApi(myChartState);
        // if (myChartState.get('scenarioData') !== '') {
        //     axios.post('/stat/cal', {
        //         nextState: myChartState.toJS()
        //     })
        //     .then(response => {
        //         console.log('response');
        //         console.log(response.data.nextState);
        //         this.props.handleAddChartDataApi(response.data.nextState);
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     })
        // } else {
        //     console.log('데이터를 입력해주세요');
        // }
    }

    _handleChange = (e) => {
        this.props.setDataValue(e.target.value);
    }

    _handleSubmit = (e) => {
        // 페이지 리로딩 방지
        e.preventDefault();
    }

    render () {
        const { scenarioData, turnNumber, turnData, selectedTurnNumber, handleNextChart, handlePrevChart, chartConfigTotal, chartConfigFlow, chartConfigTurn } = this.props;
        // let currentChartData = turnData.filter(item => item.get('turnNumber') === selectedTurnNumber).getIn([0, 'data']);
        return (
            <div style={{minWidth: '1000px'}}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            {/* { loading && <h2>로딩중...</h2>} */}
                            <Form>
                                <TextArea 
                                    placeholder={appMessage.inputStatMessage} 
                                    value={scenarioData} 
                                    onChange={this._handleChangeFn} 
                                    ref={this.input}> 
                                </TextArea>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign="middle">
                        <ChartControl
                            onSave={this._postTestFn}
                            selectedTurnNumber={selectedTurnNumber}
                            maxTurnNumber={turnNumber}
                            nextChart={handleNextChart}
                            prevChart={handlePrevChart}
                            addChart={this._calChartDataFn}
                        />
                    </Grid.Row>
                    <Divider></Divider>
                    <Grid.Row columns={3}>
                        <Grid.Column width={4}>
                            {/* <Chart
                                selectedTurnNumber={selectedTurnNumber}
                                chartData={currentChartData}
                            /> */}
                            <ChartSingle
                                chartConfigData={chartConfigTurn}
                            />
                        </Grid.Column>
                        <Divider vertical></Divider>
                        <Grid.Column width={4}>
                            <ChartSingle
                                chartConfigData={chartConfigTotal}
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <ChartSingle
                                chartConfigData={chartConfigFlow}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Divider></Divider>
                </Grid>
            </div>
        );
    };
};

const mapStateToProps = (state) => { 
    return {
        scenarioData: state.statistics.get('scenarioData'),
        selectedTurnNumber: state.statistics.get('selectedTurnNumber'),
        turnNumber: state.statistics.get('turnNumber'),
        turnData: state.statistics.get('turnData'),
        chartConfigTurn: state.statistics.get('chartConfigTurn'),
        chartConfigTotal: state.statistics.get('chartConfigTotal'),
        chartConfigFlow: state.statistics.get('chartConfigFlow')
    };
}; 

const mapDispatchToProps = (dispatch) => {
  return {
      openPortal: (value) => {dispatch(actions.openPortal(value))},
      setDataValue: (value) => {dispatch(actions.setDataValue(value))},
      handleAddChartData: () => {dispatch(actions.addChartData())},
      handleNextChart: () => {dispatch(actions.nextChart())},
      handlePrevChart: () => {dispatch(actions.prevChart())},
      handleAddChartDataApi: (value) => {dispatch(middleWare.getAddChartDataApi(value))}
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);