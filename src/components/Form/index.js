import React from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

export default class Form extends React.Component {
  constructor() {
    super();
    this.state = {
      logged: false,
    };
    this.login = this.login.bind(this);
    this.renderRedirect = this.renderRedirect.bind(this);
  }

  login() {
    this.setState(() => ({
      logged: true,
    }));
  }

  renderRedirect = () => {
    if (this.state.logged) {
      return <Redirect to="/dashoard" />;
    }
  };

  render() {
    return (
      <div>
        {this.renderRedirect()}
        <form>
          <FormGroup controlId="forms">
            <FormControl
              style={{ borderRadius: ' 8px 8px 0px 0px' }}
              type="text"
              placeholder="Email"
            />
            <FormControl
              style={{ borderRadius: ' 0px 0px 8px 8px' }}
              type="password"
              placeholder="Contraseña"
            />
          </FormGroup>
          <Button onClick={this.login} className="login__btn">
            Iniciar Sesión
          </Button>
        </form>
      </div>
    );
  }
}
