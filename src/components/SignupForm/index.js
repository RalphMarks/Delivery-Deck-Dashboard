import React from 'react';
import { Redirect } from 'react-router'
import { Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import Script from 'react-load-script';
const nanoid = require('nanoid');

export default class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      company: '',
      email: '',
      phone: '',
      password: '',
      addressQuery: '',
      address: '',
      position: [0, 0],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
    this.handleScriptLoad = this.handleScriptLoad.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleRegistration(){
    const user_data = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      password: this.state.password,
      is_active: false,
      token: nanoid(),
    };

    const company_data = {
      name: this.state.company,
      attrs: {
        address: this.state.address,
        lat: this.state.position[0],
        lng: this.state.position[1],
      }
    };

    this.props.registerUser(user_data, company_data);
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


  render() {
    return (
      <div>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyB0_spwBEpL-7BbyMnbRA8WscGXKStdoy4&libraries=places"
          onLoad={this.handleScriptLoad}
        />
        <div className="formContainer">
          <div className="form-group row">
            <h5><b>Crear una cuenta</b></h5>
          </div>
          <div className="form-group row">
            <label htmlFor="staticEmail" className="col-form-label" style={{marginLeft:'16px'}}>
              Nombre Completo
            </label>
            <div className="col-sm-12">
              <input
                type="text"
                className="form-control signup__input"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
                placeholder="Nombre(s) Apellidos"
              />
            </div>
          </div> 
          <div className="form-group row">
            <label htmlFor="staticEmail" className="col-form-label" style={{marginLeft:'16px'}}>
              Direccion
            </label>
            <div className="input-group col-sm-12">
              <input
                id="autocomplete"
                type="text"
                className="form-control signup__input"
                value={this.state.addressQuery}
                onChange={this.handleChange}s
                name="addressQuery"
                placeholder="Dirección"
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="staticEmail" className="col-form-label" style={{marginLeft:'16px'}}>
              Nombre de la Compañia
            </label>
            <div className="col-sm-12">
              <input
                type="text"
                className="form-control signup__input"
                name="company"
                value={this.state.company}
                onChange={this.handleChange}
                placeholder="Compañia"
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="staticEmail" className="col-form-label" style={{marginLeft:'16px'}}>
              Número Teléfonico
            </label>
            <div className="col-sm-12">
              <input
                type="text"
                className="form-control signup__input"
                name="phone"
                value={this.state.phone}
                onChange={this.handleChange}
                placeholder="Teléfono - (10 dígitos)"
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="staticEmail" className="col-form-label" style={{marginLeft:'16px'}}>
              Correo Electrónico
            </label>
            <div className="col-sm-12">
              <input
                type="text"
                className="form-control signup__input"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
                placeholder="Correo Electrónico"
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputPassword" className="col-form-label" style={{marginLeft:'16px'}}>
              Contraseña
            </label>
            <div className="col-sm-12">
              <input
                type="password"
                className="form-control signup__input"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                placeholder="Contraseña"
              />
              <small id="emailHelp" className="form-text text-muted" style={{textAlign:'left'}}>Contraseña minimo 8 caracteres</small>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
              <div 
                onClick={this.handleRegistration}
                className="btn btn-primary" 
                style={{ width: 'inherit', height: '40px', fontSize:'20px'}}>
                {this.props.isLoading ? <div className="lds-dual-ring"></div> : 'CREAR CUENTA'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
