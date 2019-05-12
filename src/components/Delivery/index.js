import React from 'react';
import { DragSource } from 'react-dnd';
import Pickup from './../Tasks/Pickup';
import Dropoff from './../Tasks/Dropoff';

const deliverySource = {
  beginDrag(props) {
    console.log('is dragging');
    return {delivery: props.delivery};
  },
  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }
    return props.handleDrop(props.delivery, monitor.getDropResult());
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

function getColor(state) {
  switch (state) {
    case 0:
      return '#BBBEBF';
    case 1:
      return '#764AC4';
    case 2:
      return '#2C9FF7';
    default:
      return '#FFF';
  }
}

const Delivery = props => {
  // eslint-disable-next-line no-unused-vars
  const  {isDragging, connectDragSource, delivery, tasks, handleDrop} = props;

  tasks.sort(function(task_a, task_b) {
    return task_a.order - task_b.order;
  });
  
  return connectDragSource(
    <div className="col delivery">
  {tasks.map( task => {
        if (!task.is_pickup) {
          return <Dropoff key={task.id} delivery={delivery} handleDrop={handleDrop} task_id={task.id} state={task.state}  address={task.attrs.address} recipient={task.attrs.recipient}  getColor={(state) => getColor(state)} handle_change_task_modal={props.handle_change_task_modal} />
        } else {
          return <Pickup key={task.id} delivery={delivery} handleDrop={handleDrop} task_id={task.id} state={task.state}  address={task.attrs.address} recipient={task.attrs.recipient}  getColor={(state) => getColor(state)} handle_change_task_modal={props.handle_change_task_modal}/>
        }
      })}
  </div>
  );
};

export default DragSource('delivery', deliverySource, collect)(Delivery);