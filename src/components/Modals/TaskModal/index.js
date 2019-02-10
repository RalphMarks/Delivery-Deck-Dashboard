import React from 'react';
import {
  Modal,
  FormGroup,
  FormControl,
  Radio,
  Button,
} from 'react-bootstrap';
import Script from 'react-load-script';

class TaskModal extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleScriptLoad = this.handleScriptLoad.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      phone: '',
      recipient: '',
      pickup: 'true',
      addressQuery: '',
      address: '',
      position: [0, 0],
      messenger: '',
    };
  }

  handleChange(event) {
    const target = event.target;

    this.setState({
      [target.name]: target.value,
    });
  }

  handleScriptLoad() {
    const options = {
      types: ['address'],
    }; // To disable any eslint 'google not defined' errors

    /*global google*/ this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      options
    );

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

  handleSubmit() {
    this.props.createTask(this.state);
  }

  render() {
    return (
      <Modal.Body>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyB0_spwBEpL-7BbyMnbRA8WscGXKStdoy4&libraries=places"
          onLoad={this.handleScriptLoad}
        />
        <FormGroup>
          
          <FormControl
            type="text"
            name="phone"
            value={this.state.phone}
            onChange={this.handleChange}
            placeholder="Ingresar Telefono"
          />
        </FormGroup>
        <FormGroup>
          
          <FormControl
            type="text"
            name="recipient"
            value={this.state.recipient}
            onChange={this.handleChange}
            placeholder="Ingresar Nombre"
          />
        </FormGroup>
        <FormGroup>
          <Radio
            name="pickup"
            value="true"
            inline
            checked={this.state.pickup === 'true'}
            onChange={this.handleChange}
          >
            Recolecta
          </Radio>{' '}
          <Radio
            name="pickup"
            value="false"
            inline
            checked={this.state.pickup === 'false'}
            onChange={this.handleChange}
          >
            Entrega
          </Radio>{' '}
        </FormGroup>
        <FormGroup>
          
          <FormControl
            id="autocomplete"
            type="text"
            name="addressQuery"
            value={this.state.addressQuery}
            onChange={this.handleChange}
            placeholder="Ingresar Direccion "
          />
        </FormGroup>
        <FormGroup>
          
          <FormControl
            name="messenger"
            value={this.state.messenger}
            onChange={this.handleChange}
            componentClass="select"
          >
            {this.props.messengers.map(messenger => (
              <option key={messenger.id} value={messenger.id}>
                {messenger.name}
              </option>
            ))}
          </FormControl>
        </FormGroup>
        <Button bsStyle="primary" onClick={this.handleSubmit}>
          Crear Tarea
        </Button>
      </Modal.Body>
    );
  }
}

export default TaskModal;
