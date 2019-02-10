import React from 'react';
import { Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

export default class SignupForm extends React.Component {
  constructor() {
    super();
    this.state = {
      logged: false,
      name: '',
      company: '',
      email: '',
      phone: '',
      password: '',
      user_id: '',
      user_email: '',
      user_name: '',
      company_id: '',
    };
    this.signup = this.signup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderRedirect = this.renderRedirect.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  signup() {
    const company_url = 'http://localhost:3030/company';
    const company_data = { name: this.state.company, email: this.state.email };

    //? ARROW FUNCTIONS DONT CHANGE CONTEXT
    fetch(company_url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(company_data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        console.log('Company created:', JSON.stringify(response));

        this.setState({
          company_id: response.id,
        });

        const user_url = 'http://localhost:3030/users';
        const user_data = {
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
          companyId: this.state.company_id,
        };

        //? ARROW FUNCTIONS DONT CHANGE CONTEXT
        fetch(user_url, {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(user_data), // data can be `string` or {object}!
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(response => {
            console.log('User created:', JSON.stringify(response));

            this.setState({
              user_id: response.id,
              user_name: response.name,
              user_email: response.email,
            });

            this.setState({
              logged: true,
            });

            this.renderRedirect();
          })
          .catch(error => console.error('Error:', error));
      })
      .catch(error => console.error('Error:', error));
  }

  renderRedirect = () => {
    if (this.state.logged) {
      return (
        <Redirect
          to={{
            pathname: '/dashboard',
            state: {
              user_id: this.state.user_id,
              user_email: this.state.user_email,
              user_name: this.state.user_name,
              user_company: this.state.company_id,
            },
          }}
        />
      );
    }
  };

  render() {
    return (
      <div>
        {this.renderRedirect()}

        <div className="formContainer">
          <div class="form-group row">
            <label for="staticEmail" class="col-sm-2 col-form-label">
              Nombre
            </label>
            <div class="col-sm-10">
              <input
                type="text"
                className="form-control signup__input"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
                placeholder="Nombre"
              />
            </div>
          </div>
          <div class="form-group row">
            <label for="staticEmail" class="col-sm-2 col-form-label">
              Compañia
            </label>
            <div class="col-sm-10">
              <input
                type="text"
                className="form-control signup__input"
                name="company"
                value={this.state.company}
                onChange={this.handleChange}
                placeholder="Compañia"
              />
            </div>
          </div>

          <div class="form-group row">
            <label for="staticEmail" class="col-sm-2 col-form-label">
              Teléfono
            </label>
            <div class="col-sm-10">
              <input
                type="text"
                className="form-control signup__input"
                name="phone"
                value={this.state.phone}
                onChange={this.handleChange}
                placeholder="Teléfono"
              />
            </div>
          </div>

          <div class="form-group row">
            <label for="staticEmail" class="col-sm-2 col-form-label">
              Email
            </label>
            <div class="col-sm-10">
              <input
                type="text"
                className="form-control signup__input"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
                placeholder="Email"
              />
            </div>
          </div>

          <div class="form-group row">
            <label for="inputPassword" class="col-sm-2 col-form-label">
              Password
            </label>
            <div class="col-sm-10">
              <input
                type="password"
                className="form-control signup__input"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                placeholder="Password"
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
              <Button
                onClick={this.signup}
                className="btn btn-primary"
                style={{ width: 'inherit' }}
              >
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
