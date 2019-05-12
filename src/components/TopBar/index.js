import React, { Component } from 'react';
import '../../css/top_bar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faCog,
  faSignOutAlt,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  Modal,
  FormGroup,
  FormControl,
  Button,
  Row,
  Col,
  ListGroupItem,
  ListGroup,
  ButtonGroup,
  Image,
} from 'react-bootstrap';
import TaskModal from '../Modals/TaskModal';

export default class TopBar extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.createMessenger = this.createMessenger.bind(this);
    this.createTask = this.createTask.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      isVisibleConfigModal: false,
      isVisibleTaskModal: false,
      name: '',
      phone: '',
      vehicle: 1,
      capacity: 0,
      position: [19.43426, -99.1808],
    };
  }

  handleShow(event, modal) {
    if (modal === 'configModal') {
      this.setState({ isVisibleConfigModal: true });
    } else {
      this.setState({ isVisibleTaskModal: true });
    }
  }

  handleClose(event, letter) {
    if (letter === 'taskModal') {
      this.setState({ isVisibleTaskModal: false });
    } else {
      this.setState({ isVisibleConfigModal: false });
    }
  }

  handleChange(event) {
    const target = event.target;

    this.setState({
      [target.name]: target.value,
    });
  }

  createMessenger() {
    this.setState({ isVisibleConfigModal: false });
    this.props.createMessenger(this.state);
  }

  createTask(state) {
    this.props.createTask(state);
    this.setState({ isVisibleTaskModal: false });
  }

  render() {
    return (
      <div>
        <div className="topBar">
          <FontAwesomeIcon
            className="topBar__icon"
            size="lg"
            pull="right"
            icon={faSignOutAlt}
            color="white"
          />
          <FontAwesomeIcon
            className="topBar__icon"
            size="lg"
            pull="right"
            icon={faQuestionCircle}
            color="white"
          />
          <FontAwesomeIcon
            onClick={event => this.handleShow(event, 'configModal')}
            className="topBar__icon"
            size="lg"
            pull="right"
            icon={faCog}
            color="white"
          />
          <FontAwesomeIcon
            onClick={event => this.handleShow(event, 'taskModal')}
            className="topBar__icon"
            size="lg"
            pull="right"
            icon={faPlus}
            color="white"
          />
        </div>

        <Modal
          show={this.state.isVisibleTaskModal}
          onHide={event => this.handleClose(event, 'taskModal')}
        >
          <TaskModal
            createTask={this.createTask}
            messengers={this.props.messengers}
          />
        </Modal>

        <Modal
          show={this.state.isVisibleConfigModal}
          onHide={event => this.handleClose(event, 'configModal')}
        >
          <Modal.Body>
            <Row>
              <Col xs={4}>
                <ListGroup>
                  <ListGroupItem active>Mensajeros</ListGroupItem>
                </ListGroup>
              </Col>
              <Col xs={8}>
                <form>
                  <FormGroup controlId="forms4">
                    
                    <FormControl
                      type="text"
                      placeholder="Nombre"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                    />
                    
                    <FormControl
                      type="text"
                      placeholder="Teléfono"
                      name="phone"
                      value={this.state.phone}
                      onChange={this.handleChange}
                    />
                    <ButtonGroup onChange={event => console.log(event)}>
                      <Button>
                        <Image src="img/icon-transportMode-foot.png" />
                      </Button>
                      <Button>
                        <Image src="img/icon-transportMode-bicycle.png" />
                      </Button>
                      <Button>
                        <Image src="img/icon-transportMode-scooter.png" />
                      </Button>
                      <Button>
                        <Image src="img/icon-transportMode-car.png" />
                      </Button>
                      <Button>
                        <Image src="img/icon-transportMode-truck.png" />
                      </Button>
                    </ButtonGroup>
                    <br />
                    
                    <FormControl
                      type="number"
                      name="capacity"
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
                  onClick={this.createMessenger}
                >
                  Crear
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
