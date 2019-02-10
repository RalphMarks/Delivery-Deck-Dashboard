import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../../css/Login/main.css';
import Form from '../../components/Form';

export default class Login extends React.Component {
  render() {
    return (
      <Container fluid={true}>
        <Row>
          <Col className="login" xsOffset={4} xs={4}>
            <Form />
          </Col>
        </Row>
      </Container>
    );
  }
}
