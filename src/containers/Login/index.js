import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import '../../css/Login/main.css';
import LoginForm from '../../components/LoginForm';

export default class Login extends React.Component {
  render() {
    return (
      <Container className="signupContainer" fluid={true}>
      <Row>
        <Col sm={12}>
          <Image className="signup__image" src="img/large_deliverydeck.png" />
        </Col>
        <Col style={{ margin: 'auto' }} className="signup" sm={12} md={6}>
          <LoginForm />
        </Col>
      </Row>
    </Container>
    );
  }
}
