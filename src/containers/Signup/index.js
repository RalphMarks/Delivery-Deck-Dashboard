import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import '../../css/Signup/main.css';
import SignupForm from '../../components/SignupForm';

export default class Signup extends React.Component {
  render() {
    return (
      <Container className="signupContainer" fluid={true}>
        <Row>
          <Col sm={12}>
            <Image className="signup__image" src="img/user.png" />
          </Col>
          <Col style={{ margin: 'auto' }} className="signup" sm={12} md={6}>
            <SignupForm />
          </Col>
        </Row>
      </Container>
    );
  }
}
