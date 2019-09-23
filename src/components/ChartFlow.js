import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactHighcharts from 'react-highcharts';
import { Map, List } from 'immutable';

class ChartFlow extends Component {

    constructor(props) {
        super(props);
        this._createChartConfigTotalFn = this._createChartConfigTotal.bind(this);   
    }

    _createChartConfigTotal = (chartData) => {
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

    render() {
        const { chartConfigData } = this.props;
        // const config = this._createChartConfigTotalFn(chartData);

        return (
            <div>
                {/* <ReactHighcharts config={config} ref={this.chartRef}></ReactHighcharts> */}
                <ReactHighcharts config={chartConfigData}></ReactHighcharts>
            </div>
        )
    }
}

const propTypes = {
    chartData: PropTypes.object
};

const defaultProps = {
    chartData: {}
};

ChartFlow.propTypes = propTypes;
ChartFlow.defaultProps = defaultProps;

export default ChartFlow;