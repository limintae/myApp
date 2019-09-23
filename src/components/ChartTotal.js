import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactHighcharts from 'react-highcharts';
import { Map, List } from 'immutable';

import * as utilFunction from 'utils/Function';
let chartReflow = undefined;
class ChartTotal extends Component {

    constructor(props) {
        super(props);
        this._createChartConfigTotalFn = this._createChartConfigTotal.bind(this);   
        this.chartRef = React.createRef();
    }

    componentDidUpdate() {
        const chart = this.chartRef.current ? this.chartRef.current.getChart() : {};
        chartReflow = chartReflow || chart.reflow;
        chart.reflow = () => {};
        setTimeout(() => (chart.reflow = chartReflow));
    }

    _createChartConfigTotal = (chartData) => {
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

    render() {
        const { chartConfigData } = this.props;

        return (
            <div>
                <ReactHighcharts config={chartConfigData}></ReactHighcharts>
            </div>
        )
    }
}

const propTypes = {
    // chartData: PropTypes.instanceOf(List)
    chartData: PropTypes.object
};

const defaultProps = {
    chartData: {}
};

ChartTotal.propTypes = propTypes;
ChartTotal.defaultProps = defaultProps;

export default ChartTotal;