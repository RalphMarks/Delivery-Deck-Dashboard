import React, { Component } from 'react';

import TopBar from '../../components/TopBar';
import SideBar from '../../components/SideBar';
import MyMap from '../../components/MyMap';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.handleScriptLoad = this.handleScriptLoad.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.createMessenger = this.createMessenger.bind(this);
    this.createTask = this.createTask.bind(this);

    this.state = {
      messengers: [],
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
    };
  }

  componentDidMount() {
    fetch('http://localhost:3030/messengers', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ messengers: response.data });
      })
      .catch(error => console.error('Error:', error));

    fetch('http://localhost:3030/tasks', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(response => {
        console.log(response.data);
        this.setState({ tasks: response.data });
      })
      .catch(error => console.error('Error:', error));
  }

  handleScriptLoad() {
    // Declare Options For Autocomplete
    var options = { types: ['address'] };

    // Initialize Google Autocomplete
    /*global google*/
    this.autocomplete = new google.maps.places.Autocomplete(
      this.refs.autocomplete,
      options
    );
    console.log(this.refs.autocomplete);
    console.log(this.autocomplete);

    // Fire Event when a suggested name is selected
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  }

  handlePlaceSelect() {
    // Extract City From Address Object
    let addressObject = this.autocomplete.getPlace();
    let address = addressObject.address_components;

    // Check if address is valid
    if (address) {
      // Set State
      this.setState({ taskForm_address: addressObject.formatted_address });
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

  handleSubmit(event) {
    event.preventDefault();

    const url = 'http://localhost:3030/messengers';
    const data = {
      name: this.state.messengerForm_name,
      phone: this.state.messengerForm_phone,
      vehicle: 0,
      capacity: 1,
      position: [19.43426, -99.1808],
    };

    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        console.log('Success:', JSON.stringify(response));
        let messengers = this.state.messengers;
        messengers.push(response);

        this.setState({ isVisibleConfigModal: false, messengers: messengers });
      })
      .catch(error => console.error('Error:', error));
  }

  createMessenger(data) {
    const url = 'http://localhost:3030/messengers';

    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        console.log('Success:', JSON.stringify(response));
        let messengers = this.state.messengers;
        messengers.push(response);

        this.setState({ isVisibleConfigModal: false, messengers: messengers });
      })
      .catch(error => console.error('Error:', error));
  }

  createTask(data) {
    const url = 'http://localhost:3030/tasks';

    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        console.log('Success:', JSON.stringify(response));
        let tasks = this.state.tasks;
        tasks.push(response);

        this.setState({ tasks: tasks });
      })
      .catch(error => console.error('Error:', error));
  }

  updatePosition() {
    setInterval(() => {
      console.log('Updating...');
      const messengers = Object.assign([], this.state.messengers);

      const messengerIndex = messengers.findIndex(function(messenger) {
        return messenger.name === 'Paola';
      });

      let messenger = messengers[messengerIndex];

      let lat = messenger.position[0];
      let lng = messenger.position[1];

      messenger.position = [(lat += 0.0001), (lng += 0.0001)];

      messengers[messengerIndex] = messenger;

      this.setState({ messengers: messengers });
    }, 1000);
  }
  render() {
    return (
      <div>
        <TopBar
          messengers={this.state.messengers}
          createTask={this.createTask}
          createMessenger={this.createMessenger}
        />
        <SideBar tasks={this.state.tasks} messengers={this.state.messengers} />
        <MyMap messengers={this.state.messengers} />
      </div>
    );
  }
}
