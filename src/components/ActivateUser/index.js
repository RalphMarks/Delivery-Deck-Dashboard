import React from 'react';
import { Redirect } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import client from '../../feathers';
import { runInThisContext } from 'vm';

export default class ActivateUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      was_activated: false,
    };
    this.renderRedirect = this.renderRedirect.bind(this);
  }

  componentDidMount(){
    const path = this.props.location.pathname;
    const token = path.split('/')[2];
    
    client.service('users')
    .find({token: token})
    .then( response => {
      const user = response.data[0];

      client.service('users')
      .patch(user.id, {is_active: true})
      .then( response => {
        this.setState({was_activated: true});
      });
    
    });

  }

  renderRedirect = () => {
    if (this.state.was_activated) {
      return <Redirect to={{
        pathname: "/",
        state: { user:this.state.user }
      }} />;
    }
  };

  render() {
    return (
      <div>
        {this.renderRedirect()}  
      </div>
    );
  }
}
