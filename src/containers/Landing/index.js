import React from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Image, Modal } from 'react-bootstrap';
import '../../css/Landing/main.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignupForm from '../../components/SignupForm';
import LoginForm from '../../components/LoginForm';
import client from '../../feathers';


export default class Landing extends React.Component {
  constructor(props){
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.logUser = this.logUser.bind(this);

    this.state = {
      isVisibleSignupModal: false,
      isLoadingSignupModal: false,
      isVisibleLoginModal: false,
      isLogged: false,
      user:{}
    };
  }

  notifyUserCreated = () => toast("Usuario creado, activa tu cuenta usando el link enviado a tu correo electrónico");
  notifyError = () => toast("Lo sentimos, encontramos un error procesando tu solicitud");
  notifyUniqueEmail = () => toast("Este correo seleccionado ya se encuentra en uso");
  notifyNotActive = () => toast("Tu cuenta todavia no ha sido activada");
  notifyWrongCredentials = () => toast("Correo electrónico o contraseña incorrectos");

  handleShow(e, name) {
    this.setState({
      [name]: true
    });
  }

  handleHide(e, name) {
    this.setState({
      [name]: false
    });
  }

  registerUser(user, company) {
    this.setState({isLoadingSignupModal: true});
    
    client.service('users')
    .create(user)
    .then((created_user) => {

      client.service('companies')
      .create({name: company.name, email: created_user.email, attrs: company.attrs})
      .then((created_company) => {

        client.service('users')
        .patch(created_user.id, {'companyId': created_company.id})
        .then((updated_user) => {

          client.service('send_email')
          .create({
            user_email: updated_user.email, 
            user_name: updated_user.name, 
            dashboard_url: 'https://4d9c67d1.ngrok.io', 
            user_token: updated_user.token
          })
          .then(() => {
            this.setState({isLoadingSignupModal: false});
            this.setState({
              isVisibleSignupModal: false,
            });
            this.notifyUserCreated();
          })
          .catch(error => {
            console.log('error');
            console.log(error);
            this.notifyError();
          });
        })
        .catch(error => {
          console.log('error');
          console.log(error);
          this.notifyError();
        });
      })
      .catch(error => {
        console.log('error');
        console.log(error);
        this.notifyError();
      });
    })
    .catch(error => {
      console.log('error');
      console.log(error);
      this.setState({isLoadingSignupModal: false});
      this.notifyUniqueEmail();
    });
  }

  logUser(email, password) {
    const user_data = { strategy: 'local', email: email, password: password };

    client.authenticate(user_data)
    .then((response) => {
      client.service('users')
      .find({email: email})
      .then( response => {
        const user = response.data[0];
          if (user.is_active) {
            localStorage.setItem('user', user.id);
            this.setState({user: user, isVisibleLoginModal:false});
            this.setState({isLogged: true}); 
          } else {
            this.setState({sVisibleLoginModal:false});
            this.notifyNotActive();
          }
      });
    })
    .catch(error => {
      console.log('error');
      this.notifyWrongCredentials();
    });
  }

  renderRedirect = () => {
    if (this.state.isLogged) {
      return <Redirect to={{
        pathname: "/dashboard",
      }} />;
    }
  };

  render() {
    return (
      <Container fluid={true}>
        {this.renderRedirect()}
        <ToastContainer />

        <Modal show={this.state.isVisibleLoginModal} onHide={ event => this.handleHide(event, "isVisibleLoginModal") }>
          <div className="modal-body">
            <LoginForm logUser={this.logUser}/>
          </div>
        </Modal>

        <Modal show={this.state.isVisibleSignupModal} onHide={ event => this.handleHide(event, "isVisibleSignupModal") }>
          <div className="modal-body">
            <SignupForm registerUser={this.registerUser} isLoading={this.state.isLoadingSignupModal}/>
          </div>
        </Modal>



        <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
          <header className="masthead mb-auto">
            <div className="inner">
              <nav className="nav nav-masthead justify-content-center">
                <p className="nav-link" 
                  style={{cursor: 'pointer'}}
                  onClick={ event => this.handleShow(event, "isVisibleLoginModal")}>
                  Iniciar Sesión
                </p>
                <a className="nav-link" href="/products">
                  Productos
                </a>
                <a className="nav-link" href="/about_us">
                  Sobre Nosotros
                </a>
              </nav>
              <Image src="img/large_deliverydeck.png" />
            </div>
          </header>

          <main role="main" className="inner cover">
            <h1 className="cover-heading">Logistica en un click.</h1>
            <p className="lead">
              Administracion completa de tu logistica desde un solo lugar.
              Delivery Deck ofrece una gama de productos que permite la
              automatizacion de procesos, permitiendo una mejora y aumento de
              ganancias.
            </p>
            <div className="lead">
              <p
                style={{ marginTop: '40px', width:'120px', fontSize: '16px'}}
                onClick={ event => this.handleShow(event, "isVisibleSignupModal")}
                className="btn btn-lg btn-primary"
              >
                Registrate
              </p>
            </div>
          </main>

          <footer
            className="mastfoot mt-auto"
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              left: '0',
              margin: 'auto',
            }}
          >
            <div className="inner">
              <p>
                Creado con &#9829; por{' '}
                <a href="https://www.facebook.com/nfariasjimenez">
                  @ralphmarks
                </a>
                .
              </p>
            </div>
          </footer>
        </div>
      </Container>
    );
  }
}
