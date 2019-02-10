import React from 'react';
import { Container, Image } from 'react-bootstrap';
import '../../css/Landing/main.css';

export default class Landing extends React.Component {
  render() {
    return (
      <Container fluid={true}>
        <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
          <header className="masthead mb-auto">
            <div className="inner">
              <nav className="nav nav-masthead justify-content-center">
                <a className="nav-link active" href="/login">
                  Iniciar Sesión
                </a>
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
            <p className="lead">
              <a
                style={{ marginTop: '40px' }}
                href="/signup"
                className="btn btn-lg btn-primary"
              >
                Registrate
              </a>
            </p>
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
