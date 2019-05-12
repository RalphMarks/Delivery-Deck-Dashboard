import React from 'react';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import Script from 'react-load-script';
import '../../../css/TaskModal/index.css';
class TaskModal extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleScriptLoad = this.handleScriptLoad.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.createTask = this.createTask.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);

    let messengerOptions = this.props.messengers.map((messenger) => {
      return {value: messenger.id, label: messenger.name}
    });

    this.state = {
      no_recipient: false,
      phone: '',
      recipient: '',
      pickup: 'pickup',
      addressQuery: '',
      address: '',
      notes: '',
      position: [0, 0],
      selectedMessenger: null,
      messengerOptions: messengerOptions,
    };
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
 
    this.setState({
      [target.name]: value,
    });


    if(target.name === 'no_recipient' && target.value === true) {
      this.setState({
        recipient: '',
        phone: '',
      });
    }

  }

  handleSelectChange = (selectedMessenger) => {
    this.setState({ selectedMessenger });
  }

  handleScriptLoad() {
    const options = {
      types: ['address'],
    }; // To disable any eslint 'google not defined' errors

    /*global google*/ this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      options
    );

    console.log(this.autocomplete);

    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  }

  handlePlaceSelect() {
    // Extract City From Address Object
    let addressObject = this.autocomplete.getPlace();
    let position = this.autocomplete.getPlace().geometry.location;
    let address = addressObject.address_components;

    // Check if address is valid
    if (address) {
      // Set State
      this.setState({
        address: addressObject.formatted_address,
        addressQuery: addressObject.formatted_address,
        position: [position.lat(), position.lng()],
      });
    }
  }

  handleOptionChange(e) {
    this.setState({
      pickup: e.target.value
    });
  }

  createTask() {

    let recipient = this.state.no_recipient ? "NO_RECIPIENT" : this.state.recipient;
    let phone = this.state.no_recipient ? "NO_PHONE" : this.state.phone;
    let state = this.state.selectedMessenger == null ? 0 : 1 ;
    let is_pickup = this.state.pickup === "pickup" ? true : false ;

    let data = {
      'attrs': {
        'recipient': recipient,
        'phone': phone,
        'lat': this.state.position[0],
        'lng': this.state.position[1],
        'address': this.state.address,
        'notes': this.state.notes,
      },
      'is_pickup': is_pickup,
      'state': state,
    };

    this.props.create_task(data, this.state.selectedMessenger);
    this.props.close_task_modal();
  }

  render() {
    return (
      <div className="modal-body" style={{padding:'8px 8px 0 8px'}}>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyB0_spwBEpL-7BbyMnbRA8WscGXKStdoy4&libraries=places"
          onLoad={this.handleScriptLoad}
        />

        <div className="form-group row" style={{marginTop:'8px'}}>
          <div className="col-sm-8">
            <span style={{fontSize: '13px', color:'#69747d'}}>Cliente</span>
          </div>
          <div className="col-sm-4">
            <input 
              type="checkbox" 
              className="form-check-input" 
              checked={this.state.no_recipient} 
              onChange={this.handleChange}
              name="no_recipient"
            />
            <label className="form-check-label" style={{fontSize: '13px'}}>
              Sin Cliente
            </label>
          </div>
          <div className="input-group col-sm-12">
            <input 
              type="text" 
              className="form-control create-task-input" 
              placeholder="Teléfono"
              value={this.state.phone}
              onChange={this.handleChange}
              disabled={this.state.no_recipient}
              name="phone"
              />
            <input
              type="text"
              className="form-control create-task-input"
              value={this.state.recipient}
              onChange={this.handleChange}
              disabled={this.state.no_recipient}
              name="recipient"
              placeholder="Cliente"
            />
          </div>
        </div>

        <div className="form-group row" style={{marginTop:'24px'}}>
          <div className="col-sm-4">
            <span style={{fontSize: '13px', color:'#69747d'}}>Destino</span>
          </div>
          <div className="col-sm-8">
            <div className="form-check form-check-inline">
              <input
                type="radio" 
                className="form-check-input" 
                name="inlineRadioOptions"
                checked={this.state.pickup === 'pickup'}
                onChange={this.handleOptionChange}
                value="pickup"
              />
              <label style={{fontSize: '13px', color:'#69747d'}} className="form-check-label" htmlFor="inlineRadio1">Recolecta</label>
            </div>
            <div className="form-check form-check-inline">
              <input 
                type="radio"
                className="form-check-input" 
                name="inlineRadioOptions"
                checked={this.state.pickup === 'dropoff'}
                onChange={this.handleOptionChange}
                value="dropoff"
              />
              <label style={{fontSize: '13px', color:'#69747d'}} className="form-check-label" htmlFor="inlineRadio2">Entrega</label>
            </div>
          </div>
          <div className="input-group col-sm-12">
            <input
              id="autocomplete"
              type="text"
              className="form-control create-task-input"
              value={this.state.addressQuery}
              onChange={this.handleChange}
              name="addressQuery"
              placeholder="Dirección"
            />
          </div>
          <div className="input-group col-sm-12">
            <textarea 
              value={this.state.notes}
              onChange={this.handleChange}
              name="notes"
              className="form-control create-task-input"
              placeholder="Notas de entrega"
              style={{borderTopLeftRadius:'0', borderTopRightRadius:'0', borderTop:'none'}}
            />
          </div>
        </div>

        <div className="form-group row" style={{marginTop:'24px'}}>
          <div className="col-sm-8">
            <span style={{fontSize: '13px', color:'#69747d'}}>Asignar</span>
          </div>
          <div className="col-sm-12">
            <Select
              value={this.state.selectedMessenger}
              onChange={this.handleSelectChange}
              options={this.state.messengerOptions}
              className="create-task-select"
              placeholder="Mensajeros"
            />
          </div>
        </div>
        
        <div className="form-group row" style={{marginTop:'24px'}}>
          <div className="col-sm-12">
            <div className="btn btn-cancel" style={{float:'left'}} onClick={this.props.close_task_modal}>Cancelar</div>
            <div className="btn btn-primary" style={{float:'right'}} onClick={this.createTask}>Crear</div>
          </div>
        </div>
        
      </div>
    );
  }
}

export default TaskModal;
