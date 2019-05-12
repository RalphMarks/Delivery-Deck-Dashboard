import React from 'react';
import Select from 'react-select';
import {faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



class MessengersModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      selectedMessenger: null,
    };
  }


  render(){
    return(
      <div className="modal-body" style={{padding: '8px 16px 0px 16px'}}>
        <div style={{marginBottom: '16px'}}>
          <p>Seleccionar Mensajero:</p>
          <Select
            placeholder={'Selecciona un mensajero'}
            value={this.state.selectedMessenger}
            options={[{value: '1', label:'2'}]}
          />

          <div className="btn-group" role="group" style={{margin: '16px 0', float: 'right'}}>
            <div className="btn btn-primary">
              <FontAwesomeIcon size="sm" icon={faPlus} color="white" onClick={() => {
                alert('create Messenger');
              }}/>
            </div>
            <div className="btn btn-primary">
              <FontAwesomeIcon size="sm" icon={faMinus} color="white" onClick={() => {
                alert('delete Messenger');
              }}/>
            </div>
            <div className="btn btn-primary" onClick={() => {
              alert('change Messenger');
            }}>Cambiar</div>
          </div>
        </div>
      </div>
    );
  }


}


export default MessengersModal;