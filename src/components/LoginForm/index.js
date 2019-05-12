import React from 'react';
import { Button } from 'react-bootstrap';

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleLogin(){
    this.props.logUser(this.state.email, this.state.password);
  }

  render() {
    return (
      <div>
        <div className="formContainer">
          <div className="form-group row">
            <h5><b>Iniciar Sesión</b></h5>
          </div>
          <div className="form-group row">
            <label htmlFor="staticEmail" className="col-sm-12 col-form-label">
              Email
            </label>
            <div className="col-sm-12">
              <input
                type="text"
                className="form-control signup__input"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
                placeholder="Nombre"
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="staticPassword" className="col-sm-12 col-form-label">
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
            </div>
          </div>

            <div className="form-group row">
              <div className="col-sm-12">
                <Button
                  onClick={this.handleLogin}
                  className="btn btn-primary"
                  style={{ width: 'inherit', marginTop: '24px'}}
                >
                  Iniciar Sesión
                </Button>
              </div>
          </div>
        </div>
      </div>
    );
  }
}
