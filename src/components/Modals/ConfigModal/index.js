import React from 'react';
import { Button, Image, Modal, ListGroup } from 'react-bootstrap';
import '../../../css/ConfigModal/main.css';
import {faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';


class ConfigModal extends React.Component {
  constructor(props){
    super(props);

    this.activateItem = this.activateItem.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleUserUpdate = this.handleUserUpdate.bind(this);
    this.selectMsgrVehicle = this.selectMsgrVehicle.bind(this);
    this.selectToChangeMsgrVehicle = this.selectToChangeMsgrVehicle.bind(this);
    this.deleteMessenger = this.deleteMessenger.bind(this);
    this.changeMessenger = this.changeMessenger.bind(this);
    this.handleMessengerChange = this.handleMessengerChange.bind(this);
    this.removeTaskFromDelivery = this.removeTaskFromDelivery.bind(this);
    this.addTaskToDelivery = this.addTaskToDelivery.bind(this);

    let messengerOptions = this.props.messengers.map((messenger) => {
      return {value: messenger.id, label: messenger.name}
    });

    let removeTaskOptions = this.props.deliveries.reduce((options, delivery) => {
      if(delivery.tasks.length > 1){
        delivery.tasks.forEach((task) => {
          options.push({value: `${task.id}+${delivery.id}`, label: task.attrs.address});
        });
      }
      return options;
    }, []);

    let groupTask_groupFromOptions = this.props.deliveries.reduce((options, delivery) => {
      if(delivery.tasks.length === 1){
        let task = delivery.tasks[0];
        let tasksLabel = task.attrs.address;
        options.push({value: `${task.id}+${delivery.id}`, label: tasksLabel});
      }
      return options;
    }, []);


    // not optimized
    let groupTask_groupToOptions = this.props.deliveries.reduce((options, delivery) => {
      
      if(delivery.tasks.length > 1){
        let tasksLabel = delivery.tasks.reduce((tasksLabel, task) => {
          return tasksLabel.concat(task.attrs.address, ' | ');
        }, '');
        options.push({value: `${delivery.id}`, label: tasksLabel});

      } else {
        let task = delivery.tasks[0];
        let tasksLabel = task.attrs.address;
        options.push({value: `${task.id}+${delivery.id}`, label: tasksLabel});
      }
    
      return options;
    }, []);

    this.state = {
      user_id: this.props.user.id,
      user_name: this.props.user.name,
      user_email: this.props.user.email,
      user_phone: this.props.user.phone,
      activeItem: 0,
      msgrVehicle: 0,
      mgsrName: '',
      mgsrPhone: '',
      isVisibleCreateModal: false,
      isVisibleChangeModal: false,
      messengersOptions: messengerOptions,
      taskOptions: removeTaskOptions,
      groupFromOptions: groupTask_groupFromOptions,
      groupToOptionsHelper: groupTask_groupToOptions,
      groupToOptions: groupTask_groupToOptions,
      selectedMessenger: null,
      selectedTask: null,
      selectedGroupFrom: null,
      selectedGroupTo: null,
      new_messenger_name: '',
      new_messenger_user_name: '',
      new_messenger_phone: '',
      new_messenger_vehicle: '',
      messenger_to_change_name: '',
      messenger_to_change_user_name: '',
      messenger_to_change_vehicle: '',
    };
  }

  activateItem(e, itemIndex) {
    this.setState({
      activeItem: itemIndex
    });
  }

  selectMsgrVehicle(e, itemIndex) {
    this.setState({
      new_messenger_vehicle: itemIndex
    });
  }

  selectToChangeMsgrVehicle(e, itemIndex) {
    this.setState({
      messenger_to_change_vehicle: itemIndex
    });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleSelectChange = (selectedMessenger) => {
    this.setState({ selectedMessenger });
  }

  handleTaskSelectChange = (selectedTask) => {
    this.setState({ selectedTask });
  }

  handleGroupFromChange = (selectedGroupFrom) => {
    let helper = this.state.groupToOptionsHelper;
    let groupToOptions = helper.filter((option) => {
      return selectedGroupFrom.value !== option.value;
    });
    let selectedGroupTo = null;

    this.setState({ selectedGroupFrom, groupToOptions, selectedGroupTo});
  }

  handleGroupToChange = (selectedGroupTo) => {
    this.setState({ selectedGroupTo });
  }

  handleSubmit() {
    this.props.create_messenger({
      'name': this.state.new_messenger_name,
      'user_name': this.state.new_messenger_user_name,
      'phone': this.state.new_messenger_phone,
      'vehicle': this.state.new_messenger_vehicle,
      'is_active': false,
      'on_duty': false,
      'password': Math.floor(1000 + Math.random() * 9000),
    });
    this.setState({isVisibleCreateModal: false});
    this.props.close_config_modal();
  }

  handleShow(e, name) {
    this.setState({
      [name]: true
    });
  }

  handleUserUpdate(){
    const updatedInfo = {
      name: this.state.user_name,
      email: this.state.user_email,
      phone: this.state.user_phone,
    };

    this.props.update_user_info(this.state.user_id, updatedInfo);
    this.props.close_config_modal();
  }

  deleteMessenger(){
    if(this.state.selectedMessenger !== null){
      this.props.delete_messenger(this.state.selectedMessenger.value);
      this.props.close_config_modal();
    }
  }

  changeMessenger(){
    if(this.state.selectedMessenger !== null) {
      let selectedMessengerComplete = this.props.messengers.find((messenger) => {
        return messenger.id === this.state.selectedMessenger.value;
      });
      this.setState({ 
        messenger_to_change_name: selectedMessengerComplete.name,
        messenger_to_change_user_name: selectedMessengerComplete.user_name,
        messenger_to_change_phone: selectedMessengerComplete.phone,
        messenger_to_change_vehicle: parseInt(selectedMessengerComplete.vehicle, 10),
        isVisibleChangeModal: true,
      });
    }
  }

  handleMessengerChange(){
    let messengerId = this.state.selectedMessenger.value;
    let data = {
      name: this.state.messenger_to_change_name,
      user_name: this.state.messenger_to_change_user_name,
      vehicle: this.state.messenger_to_change_vehicle,
    };
    this.props.change_messenger(messengerId, data);
    this.setState({isVisibleChangeModal: false});
    this.props.close_config_modal();
  }

  removeTaskFromDelivery(){
    let selectedTaskValues = this.state.selectedTask.value.split('+');
    this.props.remove_task_from_delivery(selectedTaskValues[0], selectedTaskValues[1]);
    this.props.close_config_modal();
  }

  addTaskToDelivery(){
    let a = this.state.selectedGroupTo.value.split('+');
    let b = this.state.selectedGroupFrom.value.split('+');

    if (a.length > 1) {
      this.props.add_task_to_delivery(a[1], b[0], b[1]);
    } else {
      this.props.add_task_to_delivery(a[0], b[0], b[1]);
    }
    this.props.close_config_modal();
  }

  render() {
    return (
        <div className="row">

          <Modal show={this.state.isVisibleCreateModal}>
            <div style={{padding: '24px'}}>
              <div className="form-group row">
                <label htmlFor="staticEmail" className="col-sm-12 col-form-label">
                  Nombre(s) Apellidos
                </label>
              <div className="col-sm-12">
                <input
                  value={this.state.new_messenger_name}
                  onChange={this.handleChange}
                  type="text"
                  className="form-control signup__input"
                  name="new_messenger_name"
                  placeholder="Nombre(s) Apellidos"
                />
              </div>
            </div>

              <div className="form-group row">
                <label htmlFor="staticEmail" className="col-sm-12 col-form-label">
                  Nombre de Usuario
                </label>
                <div className="col-sm-12">
                  <input
                    value={this.state.new_messenger_user_name}
                    onChange={this.handleChange}
                    type="text"
                    className="form-control signup__input"
                    name="new_messenger_user_name"
                    placeholder="Nombre de usuario"
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="staticEmail" className="col-sm-12 col-form-label">
                  Teléfono
                </label>
                <div className="col-sm-12">
                  <input
                    value={this.state.new_messenger_phone}
                    onChange={this.handleChange}
                    type="text"
                    className="form-control signup__input"
                    name="new_messenger_phone"
                    placeholder="Teléfono - (10 dígitos)"
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="staticEmail" className="col-sm-12 col-form-label">
                  Vehiculo
                </label>
                <div className=" col-sm-12 btn-group">
                  <button type="button" onClick={e => this.selectMsgrVehicle(e, 0)} className={this.state.new_messenger_vehicle === 0 ? "btn btn-primary active" : "btn btn-primary"}>
                    <Image src="img/icon-transportMode-foot.png" />
                  </button>
                  <button type="button" onClick={e => this.selectMsgrVehicle(e, 1)} className={this.state.new_messenger_vehicle === 1 ? "btn btn-primary active" : "btn btn-primary"}>
                    <Image src="img/icon-transportMode-bicycle.png" />
                  </button>
                  <button type="button" onClick={e => this.selectMsgrVehicle(e, 2)} className={this.state.new_messenger_vehicle === 2 ? "btn btn-primary active" : "btn btn-primary"}>
                    <Image src="img/icon-transportMode-scooter.png" />
                  </button>
                  <button type="button" onClick={e => this.selectMsgrVehicle(e, 3)} className={this.state.new_messenger_vehicle === 3 ? "btn btn-primary active" : "btn btn-primary"}>
                    <Image src="img/icon-transportMode-car.png" />
                  </button>
                  <button type="button" onClick={e => this.selectMsgrVehicle(e, 4)} className={this.state.new_messenger_vehicle === 4 ? "btn btn-primary active" : "btn btn-primary"}>
                    <Image src="img/icon-transportMode-truck.png" />
                  </button>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-sm-6">
                  <Button
                    onClick={this.handleSubmit}
                    className="btn btn-primary"
                    style={{ width: 'inherit' }}
                  >
                    Crear Mensajero
                  </Button>
                </div>
                <div className="col-sm-6">
                  <Button
                    onClick={() => (this.setState({isVisibleCreateModal: false}))}
                    className="btn btn-primary"
                    style={{ width: 'inherit' }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </Modal>

          <Modal show={this.state.isVisibleChangeModal}>
            <div style={{padding: '24px'}}>
              <div className="form-group row">
                <label htmlFor="staticEmail" className="col-sm-12 col-form-label">
                  Nombre(s) Apellidos
                </label>
              <div className="col-sm-12">
                <input
                  value={this.state.messenger_to_change_name}
                  onChange={this.handleChange}
                  type="text"
                  className="form-control signup__input"
                  name="messenger_to_change_name"
                  placeholder="Nombre(s) Apellidos"
                />
              </div>
            </div>

              <div className="form-group row">
                <label htmlFor="staticEmail" className="col-sm-12 col-form-label">
                  Nombre de Usuario
                </label>
                <div className="col-sm-12">
                  <input
                    value={this.state.messenger_to_change_user_name}
                    onChange={this.handleChange}
                    type="text"
                    className="form-control signup__input"
                    name="messenger_to_change_user_name"
                    placeholder="Nombre de usuario"
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="staticEmail" className="col-sm-12 col-form-label">
                  Vehiculo
                </label>
                <div className=" col-sm-12 btn-group">
                  <button type="button" onClick={e => this.selectToChangeMsgrVehicle(e, 0)} className={this.state.messenger_to_change_vehicle === 0 ? "btn btn-primary active" : "btn btn-primary"}>
                    <Image src="img/icon-transportMode-foot.png" />
                  </button>
                  <button type="button" onClick={e => this.selectToChangeMsgrVehicle(e, 1)} className={this.state.messenger_to_change_vehicle === 1 ? "btn btn-primary active" : "btn btn-primary"}>
                    <Image src="img/icon-transportMode-bicycle.png" />
                  </button>
                  <button type="button" onClick={e => this.selectToChangeMsgrVehicle(e, 2)} className={this.state.messenger_to_change_vehicle === 2 ? "btn btn-primary active" : "btn btn-primary"}>
                    <Image src="img/icon-transportMode-scooter.png" />
                  </button>
                  <button type="button" onClick={e => this.selectToChangeMsgrVehicle(e, 3)} className={this.state.messenger_to_change_vehicle === 3 ? "btn btn-primary active" : "btn btn-primary"}>
                    <Image src="img/icon-transportMode-car.png" />
                  </button>
                  <button type="button" onClick={e => this.selectToChangeMsgrVehicle(e, 4)} className={this.state.messenger_to_change_vehicle === 4 ? "btn btn-primary active" : "btn btn-primary"}>
                    <Image src="img/icon-transportMode-truck.png" />
                  </button>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-sm-6">
                  <Button
                    onClick={this.handleMessengerChange}
                    className="btn btn-primary"
                    style={{ width: 'inherit' }}
                  >
                    Cambiar Mensajero
                  </Button>
                </div>
                <div className="col-sm-6">
                  <Button
                    onClick={() => (this.setState({isVisibleChangeModal: false}))}
                    className="btn btn-primary"
                    style={{ width: 'inherit' }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </Modal>

          <div className="col-sm-3" style={{backgroundColor: '#2b3647', padding: '0px', marginRight: '16px'}}>
            <div  style={{width: 'inherit'}} className="btn-group-vertical btn-group-toggle" data-toggle="buttons">
              <label style={{borderRadius: '0px', fontSize: '13px'}} onClick={e => this.activateItem(e, 0)} className={this.state.activeItem === 0 ? "btn btn-primary active" : "btn btn-primary"}>
                <input style={{width: 'inherit'}} type="radio" name="options" id="option1" autoComplete="off" /> Cambiar Información
              </label>
              <label style={{borderRadius: '0px', fontSize: '13px'}} onClick={ e => this.activateItem(e, 1)} className={this.state.activeItem === 1 ? "btn btn-primary active" : "btn btn-primary"}>
                <input style={{width: 'inherit'}} type="radio" name="options" id="option2" autoComplete="off" /> Mensajeros
              </label>
              <label style={{borderRadius: '0px', fontSize: '13px'}} onClick={ e => this.activateItem(e, 2)} className={this.state.activeItem === 2 ? "btn btn-primary active" : "btn btn-primary"}>
                <input style={{width: 'inherit'}} type="radio" name="options" id="option2" autoComplete="off" /> Desagrupar Tarea
              </label>
              <label style={{borderRadius: '0px'}} onClick={ e => this.activateItem(e, 3)} className={this.state.activeItem === 3 ? "btn btn-primary active" : "btn btn-primary"}>
                <input style={{width: 'inherit'}} type="radio" name="options" id="option2" autoComplete="off" /> Agrupar Tarea
              </label>
            </div>
          </div>
      
          <div style={{padding: '16px 0px 0px'}} className="col-sm-8">
            <div style={{display: this.state.activeItem === 0 ? 'Block' : 'None'}}>
              <div className="row">
                <label htmlFor="staticEmail" className="col-sm-12 col-form-label">Nombre(s) Apellidos</label>
                <div className="col-sm-12">
                    <input
                      value={this.state.user_name}
                      onChange={this.handleChange}
                      type="text"
                      name="user_name"
                      className="form-control signup__input"
                      placeholder="Nombre(s) Apellidos"
                    />
                  </div>
              </div>

              <div className="row">
                <label htmlFor="staticEmail" className="col-sm-12 col-form-label"> Correo Electrónico</label>
                <div className="col-sm-12">
                  <input
                    value={this.state.user_email}
                    onChange={this.handleChange}
                    name="user_email"
                    type="text"
                    className="form-control signup__input"
                    placeholder="Correo Electrónico"
                  />
                </div>
              </div>

              <div className="row">
                <label htmlFor="staticEmail" className="col-sm-12 col-form-label"> Teléfono</label>
                <div className="col-sm-12">
                  <input
                    value={this.state.user_phone}
                    onChange={this.handleChange}
                    name="user_phone"
                    type="text"
                    className="form-control signup__input"
                    placeholder="Teléfono - 10 Dígitos"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="btn  btn-primary" style={{width:'inherit', margin: '10px 0px 0px 0px'}}> Cambiar Contraseña</div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div 
                    onClick={this.handleUserUpdate}
                    className="btn btn-primary" 
                    style={{float:'right', margin:'16px 0px 16px 0px'}}
                  >Actualizar</div>
                </div>
              </div>
              
            </div>
            <div style={{display: this.state.activeItem === 1 ? 'Block' : 'None'}}>
              <div style={{marginBottom: '16px'}}>
                <p>Seleccionar Mensajero:</p>

                <Select
                  placeholder={'Selecciona un mensajero'}
                  value={this.state.selectedMessenger}
                  onChange={this.handleSelectChange}
                  options={this.state.messengersOptions}
                />

                <div className="btn-group" role="group" style={{margin: '16px 0', float: 'right'}}>
                  <div className="btn btn-primary" onClick={() => this.setState({isVisibleCreateModal: true})}>
                    <FontAwesomeIcon size="sm" icon={faPlus} color="white"/>
                  </div>
                  <div className="btn btn-primary" onClick={this.deleteMessenger}>
                    <FontAwesomeIcon size="sm" icon={faMinus} color="white"/>
                  </div>
                  <div className="btn btn-primary" onClick={this.changeMessenger}>Cambiar</div>
                </div>
              </div>
          </div> 
            <div style={{display: this.state.activeItem === 2 ? 'Block' : 'None'}}>
              <div className="row">
                <div className="col-12">
                  <p>Desagrupar Tarea</p>
                  <Select
                    value={this.state.selectedTask}
                    placeholder={'Selecciona una tarea '}
                    options={this.state.taskOptions}
                    onChange={this.handleTaskSelectChange}
                  />
                  <div
                    className="btn btn-primary" 
                    style={{width:'96px', margin: '15px 0'}}
                    onClick={this.removeTaskFromDelivery}>
                    Desagrupar
                  </div>
                </div>
              </div>
            </div>
            <div style={{display: this.state.activeItem === 3 ? 'Block' : 'None'}}>
            <div className="row">
                <div className="col-12">
                  <p>Seleccionar Tarea:</p>
                  <Select
                    value={this.state.selectedGroupFrom}
                    placeholder={'Selecciona una tarea '}
                    options={this.state.groupFromOptions}
                    onChange={this.handleGroupFromChange}
                  />

                  <p>Agrupar a:</p>
                  <Select
                    value={this.state.selectedGroupTo}
                    isDisabled={this.state.selectedGroupFrom === null}
                    placeholder={'Selecciona un envio '}
                    options={this.state.groupToOptions}
                    onChange={this.handleGroupToChange}
                  />



                  <div
                    className="btn btn-primary" 
                    style={{width:'96px', margin: '15px 0'}}
                    onClick={this.addTaskToDelivery}>
                    Agrupar
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    );
  }
}

export default ConfigModal;
