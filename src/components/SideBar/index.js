import React from 'react';
import '../../css/side_bar.css';
import { Col, FormGroup, FormControl } from 'react-bootstrap';

const Pickup = props => (
  <Col className="task">
    <div className="task__inner">
      <svg
        className="task__pinIcon"
        viewBox="0 0 17 18"
        preserveAspectRatio="xMidYMid"
      >
        <path
          fill="#BBBEBF"
          d="M9 17.3c2-2.4 5.5-7.9 5.5-10.9 0-3.4-2.9-6-6-6s-6 2.6-6 6c0 3 3.6 8.5 5.5 10.9.3.3.7.3 1 0z"
        />
        <circle fill="#BBBEBF" cx="14.5" cy="14.5" r="1.75" />
        <path opacity=".3" d="M8.5 4.5L6 8h1.5v3h2V8H11z" />
      </svg>
      <div className="task__name">{props.address}</div>
      <div className="task__status">{props.recipient}</div>
    </div>
  </Col>
);

const Delivery = props => (
  <Col className="task">
    <div className="task__inner">
      <svg
        className="task__pinIcon"
        viewBox="0 0 17 18"
        preserveAspectRatio="xMidYMid"
      >
        <path
          fill="#BBBEBF"
          d="M9 17.3c2-2.4 5.5-7.9 5.5-10.9 0-3.4-2.9-6-6-6s-6 2.6-6 6c0 3 3.6 8.5 5.5 10.9.3.3.7.3 1 0z"
        />
        <circle fill="#BBBEBF" cx="2.5" cy="14.5" r="1.75" />
      </svg>
      <div className="task__name">{props.address}</div>
      <div className="task__status">{props.recipient}</div>
    </div>
  </Col>
);

const Messenger = props => (
  <Col className="messenger">
    <div className="messenger__inner">
      <svg
        className="messenger__pinIcon unresponsive"
        viewBox="0 0 15 15"
        preserveAspectRatio="xMidYMid"
      >
        <g opacity=".2" transform="translate(0 1)">
          <circle fill="black" cx="7.5" cy="7.5" r="6" />
        </g>
        <circle fill="#BBBEBF" cx="7.5" cy="7.5" r="6" />
      </svg>
      <div className="messenger__name"> {props.name} </div>
      <div className="messenger__status"> Offline </div>
    </div>
  </Col>
);

const SearchBar = () => (
  <FormGroup controlId="forms3">
    <FormControl type="text" className="sideBar__search" placeholder="Search" />
  </FormGroup>
);

const SideBar = props => (
  <div className="sideBar">
    <SearchBar />

    {props.tasks.map(task => {
      if (task.pickup) {
        return (
          <Pickup
            key={task.id}
            recipient={task.recipient}
            address={task.address}
          />
        );
      } else {
        return (
          <Delivery
            key={task.id}
            recipient={task.recipient}
            address={task.address}
          />
        );
      }
    })}

    <div className="separator" />
    {props.messengers.map(messenger => (
      <Messenger key={messenger.id} name={messenger.name} />
    ))}
  </div>
);

export default SideBar;
