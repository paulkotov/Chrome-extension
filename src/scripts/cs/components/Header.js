import React, { PropTypes, Component } from 'react';
import './Header.css';
//import { submittedData } from '../libs/api';
import { isObjEmpty } from '../libs/api';

export default class Header extends Component {
  static propTypes = {
    isAuth: PropTypes.object.isRequired,
    addData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
    loadDate: PropTypes.func.isRequired
  }
  
  constructor(){
    super();
    this.state = {
      count: 0,
      data: [],
      loginShow: false,
      fulldata: {}
    };
  }
  
  onAddHandler = () => {
    fetch(' https://pokeapi.co/api/v2/pokemon/?limit=1000' ,{
      mode: 'cors',
      method:  'GET',
      headers: {
        'Content-type': 'plain/text'
      }
    }).then(r => r.json())
      .then( (result) => {
        this.setState(
          { count: result.count, 
            data: result.results }
        );
        this.props.addData(this.state.data);  
      }).catch(alert);   
  }

  // onAddHandler = () => {
  //   fetch(' https://pokeapi.co/api/v2/pokemon/?limit=1000' ,{
  //     mode: 'cors',
  //     method:  'GET',
  //     headers: {
  //       'Content-type': 'plain/text'
  //     }
  //   }).then(r => r.json())
  //     .then( (result) => {
  //       result.map(pokemon=>{
  //         fetch(pokemon.url, {     
  //           mode: 'cors',
  //           method:  'GET',
  //           headers: {
  //             'Content-type': 'plain/text'
  //           } 
  //         }).then(r => r.json()).then(res => {
  //           this.setState({ fulldata: res });
  //         });
  //         this.props.addData(this.state.data); 
  //       });
  //     }).catch(alert);   
  // }


  onDelHandler = () => {
    this.props.deleteData();
  }
  
  loadData = () => {
    return (
      <span className="load" >
        <p>My data<br/></p> 
        <button className="loaddata btn btn-default" >
          Saved
        </button>
      </span>
    );
  };

  render() {
    const { isAuth } = this.props;
    return (
      <div>
        <h1 className="title">Decision mapper test task</h1>
        <div className="header">
          <span className="delete">
              <p>Load data<br/></p> 
              <button className="add btn btn-default" 
              onClick={this.onAddHandler}>
              Load
            </button>
          </span>
          <span className="add">
              <p>Delete data<br/></p>
              <button className="btn btn-default" 
              onClick={this.onDelHandler}>
              Clear
              </button>
          </span> 
            {isObjEmpty(isAuth) ? null : this.loadData()}
      </div>
    </div>
    );
  }
}
