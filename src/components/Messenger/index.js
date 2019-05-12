import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import Delivery from '../Delivery';
import { DropTarget } from 'react-dnd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const messengerSource = {
  drop(props) {
    return props.messenger;
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
    task: monitor.getItem(),
    drop: monitor.getDropResult(),
  }
}


function collectContextMenu(props) {
  return { deliveryId: props.deliveryId, messengerId: props.messengerId};
}


class Messenger extends React.Component {

  render(){
    // eslint-disable-next-line no-unused-vars
    const {connectDropTarget, hovered, deliveries, drop, messenger} = this.props;
    return connectDropTarget(
      <div>
        <Row>
            <Col className="messenger">
              <div className="messenger__inner">
                <Image style={{height: '16px', marginLeft:'12px', marginRight: '4px'}} src={this.props.icon} /> 
                <div className="messenger__name"> {this.props.user_name} </div>
                <div className="messenger__status"> {this.props.status} </div>
              </div>
            </Col>
          </Row>
          <Row>
            <div style={{paddingLeft: '16px', width: '100%'}}>
              {this.props.deliveries.map(delivery => (
                <ContextMenuTrigger key={delivery.id} messengerId={messenger.id} deliveryId={delivery.id} collect={collectContextMenu} id="other">
                  <Delivery key={delivery.id} tasks={delivery.tasks} handleDrop={this.props.handleDrop}/>
                </ContextMenuTrigger>
              ))}
            </div>
          </Row>  
      </div>
    );
  }
}
  
export default DropTarget('delivery', messengerSource, collect)(Messenger);
