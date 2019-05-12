import React, { Component } from 'react';
import { Redirect } from 'react-router';
import SideBar from '../../components/SideBar'; //
import Menu from '../../components/Menu';
import MyMap from '../../components/MyMap';
import client from '../../feathers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from 'react-bootstrap';
import Script from 'react-load-script';
import axios from 'axios';
import Select from 'react-select';


const LoadingDiv = () => (
  <div className="loadingDiv" style={{position:'absolute', height:'100vh', width:'100vw', zIndex:'2', backgroundColor:'white'}}>
    <h1>asdadas</h1>
  </div>
);

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleScriptLoad = this.handleScriptLoad.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.createMessenger = this.createMessenger.bind(this);
    this.deleteMessenger = this.deleteMessenger.bind(this);
    this.changeMessenger = this.changeMessenger.bind(this);
    this.handleTaskCreation = this.handleTaskCreation.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleUnassignedDelivery = this.handleUnassignedDelivery.bind(this);
    this.handleAssignedDelivery = this.handleAssignedDelivery.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.update_user_info = this.update_user_info.bind(this);
    this.removeTaskFromDelivery = this.removeTaskFromDelivery.bind(this);
    this.addTaskToDelivery = this.addTaskToDelivery.bind(this);
    this.handle_change_task_modal = this.handle_change_task_modal.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.selectTaskType = this.selectTaskType.bind(this);
    this.change_task = this.change_task.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.renderSessionRedirect = this.renderSessionRedirect.bind(this);
    this.state = {
      user: {},
      isAutoAssignActive: false,
      company: {},
      messengers: [],
      deliveries: [],
      tasks: [],
      isVisibleConfigModal: false,
      isVisibleTaskModal: false,
      messengerForm_name: '',
      messengerForm_phone: '',
      messengerForm_type: 0,
      messengerForm_capacity: 0,
      taskForm_phone: '',
      taskForm_name: '',
      taskForm_isPickup: '',
      taskForm_address: '',
      taskForm_messenger: '',
      isVisibleChangeTaskModal: false,
      user_to_change_no_recipient: false,
      user_to_change_type: false,
      user_to_change_recipient: '',
      user_to_change_pickup: 'pickup',
      user_to_change_phone: '',
      user_to_change_lat: '',
      user_to_change_lng: '',
      user_to_change_address: '',
      user_to_change_address_query: '',
      user_to_change_task_id: '',
      user_to_change_notes: '',
    };
  }

  componentDidMount() {

    if (localStorage.getItem('user') !== null){

      client.service('users')
      .get(localStorage.getItem('user'))
      .then((found_user) => {
        this.setState({user: found_user});
        this.setState({isAutoAssignActive: found_user.is_aut_assign_active});
        
        client.service('companies')
        .get(found_user.companyId)
        .then(company => {
          this.setState({company: company});

          client.service('messengers_with_locations')
          .find({query: {companyId: found_user.companyId}})
          .then((messengers) => {
            console.log('messengers');
            console.log(messengers);
            messengers.forEach(messenger => {
              client.service('messenger_deliveries')
              .find({query: {messengerId: messenger.id}})
              .then((deliveries) => {
                console.log('messengers deliveries');
                console.log(deliveries);
                const messengers = this.state.messengers;
                messenger.deliveries = deliveries;
                messengers.push(messenger);
                this.setState({messengers: messengers});
              });
            });
            client.service('unassigned_deliveries')
            .find({query: {companyId: this.state.user.companyId}})
            .then((deliveries) => {
              console.log(deliveries);
              this.setState({deliveries: deliveries})
              this.setupMessengerLocationListener();
            });
          })
          .catch( error => console.log(error));


        })
      })
      .catch((error) => {
        console.log('error getting user');
        console.log(error);
      });

    }
  }

  setupMessengerLocationListener() {

    client.service('locations').on('patched', (updatedLocation) => {
      let messengers = this.state.messengers; 
      const index = messengers.findIndex(({locationId}) => locationId === updatedLocation.id);
      if (index !== -1) {
        let messenger = messengers[index];
        messenger['location'] = updatedLocation;
        messengers[index] = messenger;
        this.setState({messengers: messengers });
      }
    });

    client.service('update_messenger_status').on('patched', (updatedMessenger) => {
      let messengers = this.state.messengers; 
      const index = messengers.findIndex(({id}) => id === updatedMessenger.id);
      if (index !== -1) {
        let messenger = messengers[index];
        messenger['on_duty'] = updatedMessenger['on_duty'];
        messengers[index] = messenger;
        this.setState({messengers: messengers });
      }
    });

    client.service('update_task_state').on('patched', (updatedTask) => {
      let messengers = this.state.messengers; 
      let updatedMessengers = messengers.map(messenger => {
        let updatedDeliveries = messenger.deliveries.map(delivery => {
          let tasks = delivery.tasks;
          const taskIndex = tasks.findIndex(({id}) => id === updatedTask.id);

            if(taskIndex !== -1){

              if (updatedTask['state'] === 2) {
                let task = tasks[taskIndex];
                task['state'] = updatedTask['state'];
                tasks[taskIndex] = task;

                client.service('send_tracking_page_sms')
                .create({taskId: updatedTask['id'], phone: updatedTask.attrs.phone, id: messenger.id})
                .then(() => {})
                .catch(error => {
                  console.log('error sending tracking page');
                  console.log(error);
                });


              } else if (updatedTask['state'] === 3) {
                tasks.splice(taskIndex, 1);
              }
              delivery.tasks = tasks;
            }

          return delivery;
        });
        messenger.deliveries = updatedDeliveries;
        messenger.name = messenger.name + ' ';
        return messenger;
      });

      this.setState({messengers: updatedMessengers });
    });

  }

  handleScriptLoad() {
    // Declare Options For Autocomplete
    var options = { types: ['address'] };

    // Initialize Google Autocomplete
    /*global google*/
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete2'),
      options
    );
    console.log(document.getElementById('autocomplete2'));
    console.log(this.autocomplete);

    // Fire Event when a suggested name is selected
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  }

  handlePlaceSelect() {
    // Extract City From Address Object
    let addressObject = this.autocomplete.getPlace();
    let position = this.autocomplete.getPlace().geometry.location;
    let address = addressObject.address_components;

    // Check if address is valid
    if (address) {
      // Set State
      this.setState({
        user_to_change_address: addressObject.formatted_address,
        user_to_change_address_query: addressObject.formatted_address,
        user_to_change_lat:position.lat(),
        user_to_change_lng:position.lng(),
      });
    }
  }

  handleShow(event) {
    const modal = event.target.getAttribute('names');

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

  createMessenger(messenger) {
    client.service('locations')
    .create({'latitude': 0, 'longitude': 0})
    .then((createdLocation) => {

      const messengerWithComapny = Object.assign({'companyId': this.state.user.companyId}, messenger);

      client.service('messengers')
      .create(Object.assign({'locationId': createdLocation.id}, messengerWithComapny))
      .then((response) => {
        let messengers = this.state.messengers;
        const  messenger = response;
        messenger.deliveries = []; // ! AL CREAR MENSAJERO NO REGRESA ATR TAREAS 
        messenger.location = createdLocation; // ! AL CREAR MENSAJERO NO TIENE LOCATION
        messengers.push(messenger);
        this.setState({messengers: messengers });

        client.service('messengers_sms')
        .create({messenger: messenger})
        .then(response => {
          toast("Mensajero Creado");
        });
      })
      .catch( error => console.log(error));
    })
    .catch( error => console.log(error));
  }

  deleteMessenger(messengerId){
    client.service('messengers')
      .remove(messengerId)
      .then((response) => {
        let messengers = this.state.messengers;
        let deletedMsgIndex = messengers.findIndex(({id}) => id === messengerId);
        messengers.splice(deletedMsgIndex,deletedMsgIndex)
        this.setState({messengers: messengers });
      })
      .catch( error => console.log(error));
  }

  changeMessenger(messengerId, data){
    client.service('messengers')
      .patch(messengerId, data)
      .then((updatedMessenger) => {
        let messengers = this.state.messengers;
        let updatedMsgIndex = messengers.findIndex(({id}) => id === messengerId);
        let messenger = messengers[updatedMsgIndex]
        messenger.name = updatedMessenger.name;
        messenger.user_name = updatedMessenger.user_name;
        messenger.vehicle = updatedMessenger.vehicle;
        messengers[updatedMsgIndex] = messenger;
        this.setState({messengers: messengers});
      })
      .catch( error => console.log(error));
  }

  handleTaskCreation(data, messengerId) {
  console.log('handleTaskCreation');
    client.service('deliveries')
    .create({state: 0, price: 0, distance: 0, companyId: this.state.user.companyId})
    .then( delivery => {
      client.service('tasks')
      .create(Object.assign({deliveryId: delivery.id}, data))
      .then( task => {
        delivery.tasks = [task];

        if (messengerId) {
          console.log('con messenger');
          client.service('deliveries')
          .patch(delivery.id,{messengerId: messengerId.value})
          .then( () => {

              console.log('found messengerId');
              console.log(messengerId);
              let messengers = this.state.messengers;
              const messengerIndex = messengers.findIndex(({id}) => id === messengerId.value);
              let chosenMessenger = messengers[messengerIndex];
              console.log('chosen');
              console.log(chosenMessenger);
              chosenMessenger.deliveries.push(delivery);
              messengers[messengerIndex] = chosenMessenger;
              this.setState({messengers: messengers});

          });
        } else {
          console.log('sin messenger');
          let deliveries = this.state.deliveries;
          deliveries.push(delivery);
          this.setState({deliveries: deliveries});
        }

      })
      .catch(error => {
        console.log('error');
        console.log(error);
        return null;
      });
    });


  }

  update_user_info(userId, data){

    client.service('users')
    .patch(userId, data)
    .then((updatedUser) => {
      this.setState({user: updatedUser});
    })
    .catch((error) => {
      console.log('Error actualizando info del usuario');
      console.log(error);
    });
  }

  handleDrop(delivery, messenger) {

    if (messenger.on_duty) {
      let deliveries = this.state.deliveries;
      let messengers = this.state.messengers; 

      const deliveryIndex = deliveries.findIndex(({id}) => id === delivery.id);
      const chosenDelivery = deliveries[deliveryIndex];

      const messengerIndex = messengers.findIndex(({id}) => id === messenger.id);
      let chosenMessenger = messengers[messengerIndex];

      chosenDelivery.state = 1;
      chosenDelivery.messengerId = messenger.id;

      chosenDelivery.tasks = chosenDelivery.tasks.map( task => {
        task.state = 1;
        return task;
      });

      deliveries.splice(deliveryIndex, 1);


      client.service('deliveries')
      .patch(delivery.id, {state: 1, messengerId: messenger.id})
      .then( response => {
        chosenDelivery.tasks.forEach((task) => {
          client.service('tasks')
          .patch(task.id, {state: 1})
          .then( response => {

          })
          .catch(error => {
            console.log('error asigning tasks');
            console.log(error);
          });
        });
      });

      
      chosenMessenger.deliveries.push(chosenDelivery);
      console.log('chosen one');
      console.log(chosenDelivery);
      messengers[messengerIndex] = chosenMessenger;

      this.setState({
        deliveries: deliveries,
        messengers: messengers,
      });

    }
  }

  handleUnassignedDelivery(e, data) {

    client.service('deliveries')
    .patch(data.deliveryId, {state: -1})
    .then((response) => {

      let deliveries = this.state.deliveries;
      const deliveryIndex = deliveries.findIndex(delivery => (delivery.id === data.deliveryId));
      let cancelledDelivery = deliveries[deliveryIndex];
      deliveries.splice(deliveryIndex, 1);
      this.setState({deliveries: deliveries}); 

      cancelledDelivery.tasks.forEach(task => {

        client.service('tasks')
        .patch(task.id, {state: -1})
        .then((response) => {

        });
        
      });
    })
    .catch( error => console.log(error));
  }

  handleAssignedDelivery(e, data){

    client.service('deliveries')
    .patch(data.deliveryId, {state: -1})
    .then((response) => {

      let messengers = this.state.messengers;
      const messengerIndex = messengers.findIndex(({id}) => (id === data.messengerId));
      let messenger = messengers[messengerIndex];
      const cancelledDeliveryIndex = messenger.deliveries.findIndex(({id}) => (id === data.deliveryId));
      const cancelledDelivery = messenger.deliveries[cancelledDeliveryIndex];

      cancelledDelivery.tasks.forEach(task => {

        client.service('tasks')
        .patch(task.id, {state: -1})
        .then((response) => {

        });
        
      });

      messenger.deliveries.splice(cancelledDeliveryIndex, 1);
      messengers[messengerIndex] = messenger;
      this.setState({messengers: messengers}); 
    })
    .catch( error => console.log(error));


    console.log(data);
  }

  handleFileUpload(content) {
    let messengers = this.state.messengers;
    let companyCoordinates = `${this.state.company.attrs.lat},${this.state.company.attrs.lng}%7C`;
    let vehicles = this.state.isAutoAssignActive ? messengers.filter(messenger => messenger.on_duty && messenger.deliveries.length === 0) : [''];
    console.log(vehicles);
    let vehicleIndexHelper = 0;

    if (vehicles.length > 0 || this.state.isAutoAssignActive !== true) {
      const fileTasks = content.split('\n').splice(1);
      const coordinates = fileTasks.map(task => {
        let s = `${task.split(',').slice(4,6)}`;
        let x = s.replace(/ /g,"+");;
        return x;
      }); //gets lat,lng 
      console.log('coordinates');
      console.log(coordinates);
      const url = `http://127.0.0.1:8000/${companyCoordinates}${coordinates.join('%7C')}/${vehicles.length}`; 

      axios.get(url)
      .then((routesResponse) => {
        let routes = Object.values(routesResponse.data).filter(route => route.distance !== 0)
        
        routes.forEach(route => {
          const messengerId =  this.state.isAutoAssignActive ? vehicles[vehicleIndexHelper].id : -1;
          const deliveryParams = this.state.isAutoAssignActive ? {state: 1, price: 0, distance: 0, companyId: this.state.user.companyId} : {state: 0, price: 0, distance: 0, companyId: this.state.user.companyId};
          let orderedTasks = this.formatRoute(fileTasks, route.route);

          client.service('deliveries')
          .create(deliveryParams)
          .then( delivery => {
            delivery.tasks = [];

            let messengers = this.state.messengers;
            let messengerIndex = messengers.findIndex(({id}) => id === messengerId);
            let messenger = messengers[messengerIndex];
            let deliveries = this.state.deliveries;

            if(this.state.isAutoAssignActive){
              messenger.deliveries.push(delivery);
            } else {
              deliveries.push(delivery);
            }

            orderedTasks.forEach((task, key, tasks) => {
              client.service('tasks')
              .create(Object.assign({deliveryId: delivery.id}, task))
              .then( savedTask => {
                if (this.state.isAutoAssignActive) {
                  
                  let dd = messenger.deliveries.pop();
                  dd.tasks.push(savedTask);
                  messenger.deliveries.push(dd);
                  messengers[messengerIndex] = messenger;
                  this.setState({messengers: messengers});

                } else {
                  let dd = deliveries.pop();
                  dd.tasks.push(savedTask);
                  deliveries.push(dd);
                  this.setState({deliveries: deliveries});

                }

                if (Object.is(tasks.length - 1, key)) {
                  console.log('final task call');
                  client.service('deliveries')
                  .patch(delivery.id, {messengerId: messengerId})
                  .then((d) => {}); 
                }
              })
              .catch((error) => {
                console.log(error);
              });


            }) 
          })
          .catch((error) => {
            console.log(error);
          });
          vehicleIndexHelper+=1;
        });
      }).
      catch(error => {
        console.log('error');
        console.log(error);
      });
    } else {
      toast("No hay mensajeros activos sin tareas asignadas");
    }
  }

  formatRoute(fileTasks, route){
    //Removes the depot indexes !== 0 and adjusts the rest of the tasks (val - 1) because the 
    //depot address was added to the url 
    const orderedTasks = route.reduce((acc, val) => {
      if (val !== 0) {
        const task = fileTasks[val - 1].split(',');
        const taskStruct = {
          state: this.state.isAutoAssignActive ? 1 : 0, 
          is_pickup: task[0], 
          attrs:{
            recipient: task[1], 
            phone: task[2], 
            address: task[3], 
            lat: task[4], 
            lng: task[5]}, 
            order: acc.length
        }
        acc.push(taskStruct);
      } 
      return acc;
    }, []);
    return orderedTasks;
  }

  removeTaskFromDelivery(task_id, delivery_id){

    client.service('deliveries')
    .create({state: 0, price: 0, distance: 0, companyId: this.state.user.companyId})
    .then( created_delivery => {
      client.service('tasks')
      .patch(task_id, {deliveryId: created_delivery.id})
      .then( created_task => {
        const deliveries = this.state.deliveries;
        const deliveryIndex = deliveries.findIndex(({id}) => id === parseInt(delivery_id, 10));
        let updatedDelivery = deliveries[deliveryIndex];
        const taskIndex = updatedDelivery.tasks.findIndex(({id}) => id === parseInt(task_id, 10));
        updatedDelivery.tasks.splice(taskIndex, 1);


        let routerUrlHelper = updatedDelivery.tasks.map( task => `${task.attrs.lat},${task.attrs.lng}`);
        let routerUrl = routerUrlHelper.join('%7C');
        let companyCoordinates = `${this.state.company.attrs.lat},${this.state.company.attrs.lng}%7C`;
        let requestUrl = `http://127.0.0.1:8000/calc_route/v1/${companyCoordinates}${routerUrl}`;
        let indexHelper = 0;

        axios.get(`${requestUrl}`)
        .then(function (response) {
          let routeWithMessengerIndex = response.data.route;
          routeWithMessengerIndex.pop();
          routeWithMessengerIndex.splice(0, 1);

          routeWithMessengerIndex.forEach(taskIndex => {
            let taskHelper = updatedDelivery.tasks[taskIndex - 1];
            taskHelper['order'] = indexHelper;
            indexHelper += 1;
          });

          updatedDelivery.tasks.sort(function(task_a, task_b) {
            return task_a.order - task_b.order;
          });

          updatedDelivery.tasks.forEach((task) => {
            client.service('tasks')
            .patch(task.id, {order: task.order})
            .then( response => {
  
            });
          });

        })
        .catch(function (error) {
          console.log(error);
        });


        deliveries[deliveryIndex] = updatedDelivery;

        created_delivery.tasks = [created_task];
        deliveries.push(created_delivery);
        this.setState({deliveries: deliveries});


      });
    });


  }

  addTaskToDelivery(deliveryId, groupFromTaskId, groupFromDeliveryId){

    client.service('deliveries')
    .remove(groupFromDeliveryId)
    .then( result => {

      client.service('tasks')
      .patch(groupFromTaskId, {deliveryId: deliveryId})
      .then( created_task => {

        const deliveries = this.state.deliveries;
        console.log('deliveries');
        console.log(deliveries);
        const groupFromDeliveryIndex = deliveries.findIndex(({id}) => id === parseInt(groupFromDeliveryId, 10)); 
        deliveries.splice(groupFromDeliveryIndex, 1);

        console.log('deliveries with deleted');
        console.log(deliveries);

        const groupToDeliveryIndex = deliveries.findIndex(({id}) => id === parseInt(deliveryId, 10)); 
        let groupToDelivery = deliveries[groupToDeliveryIndex];
        console.log('deliveries para asignar');
        console.log(groupToDelivery);
        groupToDelivery.tasks.push(created_task);

        console.log('deliveries ya asignada');
        console.log(groupToDelivery);

        let routerUrlHelper = groupToDelivery.tasks.map( task => `${task.attrs.lat},${task.attrs.lng}`);
        let routerUrl = routerUrlHelper.join('%7C');
        let companyCoordinates = `${this.state.company.attrs.lat},${this.state.company.attrs.lng}%7C`;
        let requestUrl = `http://127.0.0.1:8000/calc_route/v1/${companyCoordinates}${routerUrl}`;
        let indexHelper = 0;

        axios.get(`${requestUrl}`)
        .then((response) => {
          let routeWithMessengerIndex = response.data.route;
          routeWithMessengerIndex.pop();
          routeWithMessengerIndex.splice(0, 1);

          routeWithMessengerIndex.forEach(taskIndex => {
            let taskHelper = groupToDelivery.tasks[taskIndex - 1];
            taskHelper['order'] = indexHelper;
            indexHelper += 1;
          });

          groupToDelivery.tasks.sort(function(task_a, task_b) {
            return task_a.order - task_b.order;
          });

          deliveries[groupToDeliveryIndex] = groupToDelivery;
          this.setState({deliveries: deliveries});


          groupToDelivery.tasks.forEach((task) => {
            client.service('tasks')
            .patch(task.id, {order: task.order})
            .then( response => {
  
            });
          });          
        })
        .catch(function (error) {
          console.log(error);
        });



  
      });
    });


  }

  handle_change_task_modal(id){

    client.service('tasks')
    .get(id)
    .then( task => {
      console.log('found task');
      console.log(task);

      this.setState({
        user_to_change_task_id: task.id,
        user_to_change_type: task.type,
        user_to_change_recipient: task.attrs.recipient,
        user_to_change_phone: task.attrs.phone,
        user_to_change_address_query: task.attrs.address,
        user_to_change_lat: task.attrs.lat,
        user_to_change_lng: task.attrs.lng,
        isVisibleChangeTaskModal: true,
      });

    });

    this.setState({isVisibleChangeTaskModal: true});
  }

  handleHide(e, name) {
    this.setState({
      [name]: false
    });
  }

  handleChange(event) {
    const target = event.target;

    this.setState({
      [target.name]: target.value,
    });
  }

  handleSwitchChange(newValue) {
    let user = this.state.user;
    this.setState({ isAutoAssignActive: newValue});
    client.service('users')
    .patch(user.id, {is_aut_assign_active: newValue})
    .then(result => {})
    .catch(error => {
      console.log(error);
    });
  }

  selectTaskType(e, itemIndex) {
    this.setState({
      user_to_change_type: itemIndex
    });
  }

  change_task(){
    client.service('tasks')
    .patch(this.state.user_to_change_task_id, {
      type: this.state.user_to_change_type,
      attrs:{
        recipient: this.state.user_to_change_recipient,
        phone: this.state.user_to_change_phone,
        address: this.state.user_to_change_address_query,
        lat: this.state.user_to_change_lat,
        lng: this.state.user_to_change_lng,
      }
    })
    .then( updated_task => {
      const deliveries = this.state.deliveries;
      const deliveryIndex = deliveries.findIndex(({id}) => id === parseInt(updated_task.deliveryId, 10));
      let updatedDelivery = deliveries[deliveryIndex];
      const taskIndex = updatedDelivery.tasks.findIndex(({id}) => id === parseInt(updated_task.id, 10));
      updatedDelivery.tasks[taskIndex] = updated_task;
      deliveries[deliveryIndex] = updatedDelivery;
      this.setState({deliveries: deliveries});
    }); 
  }

  renderSessionRedirect = () => {
    if (localStorage.getItem('user') === null) {
      return <Redirect to={{
        pathname: "/",
      }} />;
    }
  };

  render() {
    return (
      <div>
        <ToastContainer />

        <LoadingDiv />
        
        {this.renderSessionRedirect()}

        <Modal style={{maxWidth:'300px', marginLeft:'auto', marginRight: 'auto'}} show={this.state.isVisibleChangeTaskModal} onHide={ event => this.handleHide(event, "isVisibleChangeTaskModal") }>
          <div className="modal-body" style={{padding:'8px 8px 0 8px'}}>
            <Script
              url="https://maps.googleapis.com/maps/api/js?key=AIzaSyB0_spwBEpL-7BbyMnbRA8WscGXKStdoy4&libraries=places"
              onLoad={this.handleScriptLoad}/>

            <div className="form-group row" style={{marginTop:'8px'}}>
            <div className="col-sm-8">
              <span style={{fontSize: '13px', color:'#69747d'}}>Cliente</span>
            </div>
            <div className="col-sm-4">
              <input 
                type="checkbox" 
                className="form-check-input" 
                checked={this.state.user_to_change_no_recipient} 
                onChange={this.handleChange}
                name="user_to_change_no_recipient"
              />
              <label className="form-check-label" style={{fontSize: '13px'}}>
                Sin Cliente
              </label>
            </div>
            <div className="input-group col-sm-12">
              <input 
                type="text" 
                className="form-control create-task-input" 
                placeholder="Teléfono"
                value={this.state.user_to_change_phone}
                onChange={this.handleChange}
                disabled={this.state.user_to_change_no_recipient}
                name="user_to_change_phone"
                />
              <input
                type="text"
                className="form-control create-task-input"
                value={this.state.user_to_change_recipient}
                onChange={this.handleChange}
                disabled={this.state.user_to_change_no_recipient}
                name="user_to_change_recipient"
                placeholder="Cliente"
              />
            </div>
          </div>

            <div className="form-group row" style={{marginTop:'24px'}}>
              <div className="col-sm-4">
                <span style={{fontSize: '13px', color:'#69747d'}}>Destino</span>
              </div>
              <div className="col-sm-8">
                <div className="form-check form-check-inline">
                  <input
                    type="radio" 
                    className="form-check-input" 
                    name="inlineRadioOptions"
                    checked={this.state.user_to_change_pickup === 'pickup'}
                    onChange={this.handleChange}
                    value="pickup"
                  />
                  <label style={{fontSize: '13px', color:'#69747d'}} className="form-check-label" htmlFor="inlineRadio1">Recolecta</label>
                </div>
                <div className="form-check form-check-inline">
                  <input 
                    type="radio"
                    className="form-check-input" 
                    name="inlineRadioOptions"
                    checked={this.state.pickup === 'dropoff'}
                    onChange={this.handleChange}
                    value="dropoff"
                  />
                  <label style={{fontSize: '13px', color:'#69747d'}} className="form-check-label" htmlFor="inlineRadio2">Entrega</label>
                </div>
              </div>
              <div className="input-group col-sm-12">
                <input
                  id="autocomplete"
                  type="text"
                  className="form-control create-task-input"
                  value={this.state.user_to_change_address_query}
                  onChange={this.handleChange}
                  name="user_to_change_address_query"
                  placeholder="Dirección"
                />
              </div>
              <div className="input-group col-sm-12">
              <textarea 
                value={this.state.user_to_change_notes}
                onChange={this.handleChange}
                name="user_to_change_notes"
                className="form-control create-task-input"
                placeholder="Notas de entrega"
                style={{borderTopLeftRadius:'0', borderTopRightRadius:'0', borderTop:'none'}}
              />
            </div>
            </div>
          
            <div className="form-group row" style={{marginTop:'24px'}}>
              <div className="col-sm-12">
                <div className="btn btn-cancel" style={{float:'left'}} onClick={() => (this.setState({isVisibleChangeTaskModal: false}))}>Cancelar</div>
                <div className="btn btn-primary" style={{float:'right'}} onClick={this.change_task}>Cambiar</div>
              </div>
            </div>

          </div>
        </Modal>

        <Menu
          user={this.state.user} 
          is_auto_assign_active={this.state.isAutoAssignActive}
          messengers={this.state.messengers} 
          deliveries={this.state.deliveries}
          create_messenger={this.createMessenger} 
          delete_messenger={this.deleteMessenger}
          change_messenger={this.changeMessenger}
          create_task={this.handleTaskCreation}
          update_user_info={this.update_user_info}
          handle_file_upload={this.handleFileUpload}
          remove_task_from_delivery={this.removeTaskFromDelivery}
          add_task_to_delivery={this.addTaskToDelivery}
          handle_switch={this.handleSwitchChange}/>
        
        <SideBar 
          handleUnassignedDelivery={(e, data) => this.handleUnassignedDelivery(e, data)} 
          handleAssignedDelivery={(e, data) => this.handleAssignedDelivery(e, data)} 
          handleDrop={(delivery, messenger) => this.handleDrop(delivery, messenger)} 
          deliveries={this.state.deliveries} 
          messengers={this.state.messengers}
          handle_change_task_modal={this.handle_change_task_modal}
          handleFileUpload={this.handleFileUpload}
          />
        
        <MyMap 
          handleDrop={(delivery, messenger) => this.handleDrop(delivery, messenger)}  
          messengers={this.state.messengers} 
          deliveries={this.state.deliveries} 
          company={this.state.company}
          />

      </div>
    );
  }
}
