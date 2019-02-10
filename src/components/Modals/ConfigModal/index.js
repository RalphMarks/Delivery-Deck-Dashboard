import React from 'react';
import {
  Modal,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  Row,
  Col,
  HelpBlock,
} from 'react-bootstrap';

class ConfigModal extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      phone: '',
      name: '',
      capacity: '',
    };
  }

  handleChange(event) {
    const target = event.target;

    this.setState({
      [target.name]: target.value,
    });
  }

  handleSubmit(event) {}

  render() {
    return (
      <Modal>
        <Modal.Body>
          <Row>
            <Col xs={12}>
              <form>
                <FormGroup controlId="forms2">
                  <ControlLabel>Nombre</ControlLabel>
                  <FormControl
                    type="text"
                    name="messengerForm_name"
                    placeholder="Nombre"
                    value={this.state.name}
                    onChange={this.handleChange}
                  />

                  <ControlLabel>Teléfono</ControlLabel>
                  <FormControl
                    type="text"
                    name="messengerForm_phone"
                    placeholder="Teléfono"
                    value={this.state.phone}
                    onChange={this.handleChange}
                  />
                  <HelpBlock>Introduce 10 digitos.</HelpBlock>

                  <ControlLabel>Capacidad</ControlLabel>
                  <FormControl
                    type="number"
                    name="messengerForm_capacity"
                    value={this.state.capacity}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </form>
              <Button
                bsStyle="primary"
                style={{
                  position: 'relative',
                  float: 'right',
                  marginRight: '16px',
                }}
                onClick={this.handleSubmit}
              >
                Crear
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  }
}

export default ConfigModal;
