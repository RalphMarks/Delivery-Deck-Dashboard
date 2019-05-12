import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import '../../css/Signup/main.css';
import SignupForm from '../../components/SignupForm';

export default class Signup extends React.Component {
  render() {
    return (
      <Container className="signupContainer" fluid={true}>
        <Row style={{backgroundColor:'#f5f5f5'}}>
          <Col sm={12}>
            <Image className="signup__image" src="img/user.png" />
          </Col>
          <Col style={{ marginLeft: 'auto', marginRight:'auto', marginBottom: '24px'}} className="signup" sm={12} md={6}>
            <SignupForm />
          </Col>
        </Row>
      </Container>
    );
  }
}
