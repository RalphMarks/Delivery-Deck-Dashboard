import React from 'react';
import '../../css/side_bar.css';
import {FormGroup, FormControl } from 'react-bootstrap';
import Messenger from '../Messenger';
import Delivery from '../Delivery';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";


const SearchBar = () => (
  <FormGroup controlId="forms3">
    <FormControl type="text" className="sideBar__search" placeholder="Search" />
  </FormGroup>
);

function collect(props) {
  return { deliveryId: props.deliveryId };
}

function collect2(props) {
  return { messengerId: props.messengerId };
}

class SideBar extends React.Component {

  render(){
    return(
      <div className="sideBar">
        <ContextMenu id="some_unique_identifier">
          <MenuItem onClick={this.props.handleUnassignedDelivery}>
            Eliminar
          </MenuItem>
        </ContextMenu>
        <ContextMenu id="other">
          <MenuItem onClick={this.props.handleAssignedDelivery}>
            Eliminar :D
          </MenuItem>
        </ContextMenu>
        <SearchBar />

      <div className="separator" />
      {this.props.messengers.map(messenger => {
        
        const icon = (messenger.on_duty) ? "img/onlinedot.png" : "img/offlinedot.png";
        const status = (messenger.on_duty) ? "Online" : "Offline";
        return(
          <Messenger 
            key={messenger.id}
            messenger={messenger}
            name={messenger.name}
            user_name={messenger.user_name}
            deliveries={messenger.deliveries}
            icon={icon}
            status={status} 
            handleAssignedDelivery={this.props.handleAssignedDelivery} //! allows the refresh when deleting deliveries
            handleUnassignedDelivery={this.props.handleUnassignedDelivery}
            handleDrop={this.props.handleDrop}
          />
        );
      })}

      <div className="separator" />

      {this.props.deliveries.map(delivery => {
          return(
            <ContextMenuTrigger key={delivery.id} deliveryId={delivery.id}  collect={collect} id="some_unique_identifier">
              <Delivery key={delivery.id} handleDrop={this.props.handleDrop} delivery={delivery} tasks={delivery.tasks} handle_change_task_modal={this.props.handle_change_task_modal}/>
            </ContextMenuTrigger>
          );
      })} 
    </div>
    );
  }
}
  

export default SideBar;
