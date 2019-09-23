import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactHighcharts from 'react-highcharts';
import { Map, List } from 'immutable';

import * as utilFunction from 'utils/Function'
let chartReflow = undefined;
class Chart extends Component {

    constructor(props) {
        super(props);
        this._createChartConfigFn = this._createChartConfig.bind(this);   
        this.chartRef = React.createRef();
    }

    componentDidUpdate() {
        const chart = this.chartRef.current ? this.chartRef.current.getChart() : {};
        chartReflow = chartReflow || chart.reflow;
        chart.reflow = () => {};
        setTimeout(() => (chart.reflow = chartReflow));
    }

    _createChartConfig = (chartData, selectedTurnNumber) => {
        // const tmpMap = Map({
        //     pos: itemPos,
        //     name: '',
        //     type: item.get('cmd'),
        //     y: damage
        // })
        let data = List([]);
        chartData.forEach((item, index) => {
            
            const tmpMap = Map({
                pos: item.get('pos'),
                name: item.get('name'),
                type: item.get('type'),
                color: utilFunction.setChartColorByType(item.get('type')),
                y: item.get('normal') + item.get('ability'),
                normal: item.get('normal'),
                ability: item.get('ability')
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
                    formatter += `<span style="font-weight: bold;">total</span>: ${this.point.y}<br/>`;
                    formatter += `<span style="font-weight: bold;">normal</span>: ${this.point.normal}<br/>`;
                    formatter += `<span style="font-weight: bold;">ability</span>: ${this.point.ability}<br/>`;
                    formatter += `<span style="font-weight: bold;">Type</span>: ${this.point.type}<br/>`;
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

    render() {
        const { chartData, selectedTurnNumber } = this.props;

        //console.log('chartData : ' + chartData);
        const config = this._createChartConfig(chartData, selectedTurnNumber);

        return (
            <div>
                {/* 11111 {this._tmpfuncFn()} */}
                {/* <ReactHighcharts config={config} ref={this.chartRef}></ReactHighcharts> */}
                <ReactHighcharts config={config}></ReactHighcharts>
            </div>
        )
    }
}

const propTypes = {
    chartData: PropTypes.instanceOf(List),
    selectedTurnNumber: PropTypes.number
};

const defaultProps = {
    chartData: List([]),
    selectedTurnNumber: 0
};

Chart.propTypes = propTypes;
Chart.defaultProps = defaultProps;

export default Chart;