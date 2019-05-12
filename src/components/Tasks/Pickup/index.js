import React from 'react';
import { Col } from 'react-bootstrap';


const Pickup = props => {
  const color = props.getColor(props.state);
  return(
    <Col onDoubleClick={() => props.handle_change_task_modal(props.task_id)} className="task">
    <div className="task__inner">
      <svg
        className="task__pinIcon"
        viewBox="0 0 17 18"
        preserveAspectRatio="xMidYMid"
      >
        <path
          fill={color}
          d="M9 17.3c2-2.4 5.5-7.9 5.5-10.9 0-3.4-2.9-6-6-6s-6 2.6-6 6c0 3 3.6 8.5 5.5 10.9.3.3.7.3 1 0z"
        />
        <circle fill={color} cx="14.5" cy="14.5" r="1.75" />
        <path opacity=".3" d="M8.5 4.5L6 8h1.5v3h2V8H11z" />
      </svg>
      <div className="task__name">{props.address}</div>
      <div className="task__status">{props.recipient}</div>
    </div>
  </Col>
  );
};


export default Pickup;