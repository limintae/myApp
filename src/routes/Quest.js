//import core
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Map, List, fromJS } from 'immutable';
import axios from 'axios';

//import components
import QuestTypeList from 'containers/QuestTypeList';
import QuestList from 'containers/QuestList'
//import Value from 'components/Value';
import * as actions from 'store/actions';

import './Quest.css';

class Quest extends Component {
    
    constructor(props) {
       super(props);

       this.state = {
        data: Map({
          questData: List([])
        })
      };
    }

    componentDidMount() {
        this.getQuestData();
    }

    getQuestData = () => {
      // axios.get('/questListData').then(response => {
      axios.get('/quest').then(response => {
        const questTypeData = fromJS(response.data.questTypeData);
        const questData = fromJS(response.data.questData);

        let result = List([]);
        questTypeData.forEach((item, index) => {
          const questType = item.get('questType');
          result = result.push(Map({
            index: index,
            questType: questType,
            questList: questData.filter(item => item.get('questType') === questType)
          }))
        })

        const { data } = this.state;
        this.setState({
          data: data.set('questData', result)
        });        
      })
    }

    

    render () {
      const { data } = this.state; 
      const { questType, questList, handleSetList, handleIncrement } =  this.props;
      //const tmpData = data.get('questData').filter(item => item.get('questType') === 'hard');
      //console.log(tmpData.filter(item => item.get('id') === 0).toJS());
      //console.log(tmpData.get(0).get('questList').toJS());
      //const tmpData2 = tmpData.get(0).filter(item => item.get('questList2'));

      // console.log(`hard data : ${data.get('questList').filter(item => item.get('questType') === 'hard')}`);
      // filter(item => item.get('questList'))

      return (
            // <Grid celled padded style={{height: '100vh', width: '100vw'}} columns={2} divided>
            //   <Grid.Row>
            //     <Grid.Column width={3} divided>
            //       {/* <QuestTypeList data={this.state.data}/> */}
            //       <QuestTypeList 
            //           questData={data.get('questData')}
            //           onSetList={handleSetList}
            //           onPlus={handleIncrement}
            //       />
            //     </Grid.Column>
            //     <Grid.Column width={13}>
            //       {/* <Value number={number}/> */}
            //       <QuestList
            //         questType={questType}
            //         questList={questList}
            //       />
            //       {/* 클릭했을때 type별 퀘스트들이 나올 자리 */}
            //     </Grid.Column>
            //   </Grid.Row>
            // </Grid>

            <div className="page-wrap">
              <div className="wrapper">
                <div className="main-wrap">
                  <QuestTypeList 
                        questData={data.get('questData')}
                        onSetList={handleSetList}
                        onPlus={handleIncrement}
                    />
                </div>
                <div className="sub-wrap">
                  <QuestList
                      questType={questType}
                      questList={questList}
                    />
                </div>
              </div>
            </div>
      );
    };
};

// redux의 store안에있는걸 이 컴포넌트의 props로 Mapping해준다
// redux사용 시 mapStateToProps맵핑값을 변화 setState기능을 자동으로 해준다.
const mapStateToProps = (state) => { //state를 파라메터로 받고(그냥 파라메터 이름이 state인거다 component의 state와는 다르다)
  //action 처리 후 이쪽으로 넘어온다 액션에서 return한 state값을 사용
  return {
      //questType: state.quests.questType
      questType: state.quests.get('questType'), //combineReducers 로 reducer를 통합했기때문에 state.{reducerName}.get('')으로 사용해야한다
      questList: state.quests.get('questList'),
      number: state.quests.get('number')
      //questType: state.data.questTypeList.questType, //number라는 props를 연결 , number의 값은 state.counter.number값으로 연결한다/
      //questList: state.data.questTypeList.questList
  };
};

//액션을 담당할 함수를 연결해준다
const mapDispatchToProps = (dispatch) => {
  //mapDispatchToProps 사용 파라메터 바인딩도 자동이다 하지만 우린사용안함 나중에 익숙해지면 사용하자
  //return bindActionCreators(actions, dispatch);

  return {
      handleSetList: (questData, questType) => { dispatch(actions.setList(questData, questType)) },
      handleIncrement: () => { dispatch(actions.increment())}, //함수 handleIncrement 를 만들어서 actions에서 increment를 받아서 dispatch한다
      // handleDecrement: () => { dispatch(actions.decrement())},
      // handleSetColor: (color) => { dispatch(actions.setColor(color))}
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Quest);