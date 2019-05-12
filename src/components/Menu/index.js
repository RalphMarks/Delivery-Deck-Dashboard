import React from 'react';
import { Redirect } from 'react-router';
import '../../css/menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faCog,
  faSignOutAlt,
  faQuestionCircle,
  faFileUpload,
} from '@fortawesome/free-solid-svg-icons';
import Switch from "react-switch";
import { Modal } from 'react-bootstrap';
import ConfigModal from '../Modals/ConfigModal';
import TaskModal from '../Modals/TaskModal';
import UploadModal from '../Modals/UploadModal';
import MessengersModal from '../Modals/MessengersModal';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.renderCloseSessionRedirect = this.renderCloseSessionRedirect.bind(this);
    this.state = {
      isVisibleTaskModal: false,
      isVisibleConfigModal: false,
      isVisibleUploadModal: false,
      isVisibleMessengersModal: false,
      isSessionClosed: false,
    };
  }

  handleShow(e, name) {
    this.setState({
      [name]: true
    });
  }

  handleHide(e, name) {
    this.setState({
      [name]: false
    });
  }

  renderCloseSessionRedirect = () => {
    if (this.state.isSessionClosed) {
      localStorage.clear();
      return <Redirect to={{
        pathname: "/",
      }} />;
    }
  };

  render() {
    return(
      <div className="menu">
        {this.renderCloseSessionRedirect()}
        <div className="menu__icons">
          <FontAwesomeIcon
              onClick={(e) => (this.setState({isSessionClosed: true}))}
              className="menu__icon"
              size="lg"
              pull="right"
              icon={faSignOutAlt}
              color="white"
            />
            <label style={{marginTop: '6px'}}>
              <Switch 
                checkedIcon={<span style={{color:'#FFF', right: '-24px', position: 'absolute'}}>Auto</span>} 
                uncheckedIcon={<span style={{color:'#FFF', left:'-26px', position:'absolute'}}>Manual</span>} 
                height={24}
                width={88}
                onColor="#73cd2b"
                onChange={this.props.handle_switch} 
                checked={this.props.is_auto_assign_active}
              />
            </label>
            <FontAwesomeIcon
              onClick={ e => this.handleShow(e, "isVisibleConfigModal")}
              className="menu__icon"
              size="lg"
              pull="right"
              icon={faCog}
              color="white"
            />
            <FontAwesomeIcon
              onClick={ e => this.handleShow(e, "isVisibleUploadModal")}
              className="menu__icon"
              size="lg"
              pull="right"
              icon={faFileUpload}
              color="white"
            />
            <FontAwesomeIcon
              onClick={ e => this.handleShow(e, "isVisibleTaskModal")}
              className="menu__icon"
              size="lg"
              pull="right"
              icon={faPlus}
              color="white"
            />
        </div>
      
        <Modal style={{maxWidth:'300px', marginLeft:'auto', marginRight: 'auto'}} show={this.state.isVisibleTaskModal} onHide={ e => this.handleHide(e, "isVisibleTaskModal") }>
          <TaskModal 
            create_task={this.props.create_task} 
            messengers={this.props.messengers} 
            close_task_modal={() => (this.setState({isVisibleTaskModal: false}))}/>
        </Modal>
        
        <Modal show={this.state.isVisibleConfigModal} onHide={ e => this.handleHide(e, "isVisibleConfigModal") }>
          <ConfigModal 
            user={this.props.user}
            messengers={this.props.messengers} 
            deliveries={this.props.deliveries}
            create_messenger={this.props.create_messenger} 
            delete_messenger={this.props.delete_messenger}
            change_messenger={this.props.change_messenger}
            update_user_info={this.props.update_user_info}
            close_config_modal={() => (this.setState({isVisibleConfigModal: false}))}
            add_delivery={this.props.add_delivery}
            remove_task_from_delivery={this.props.remove_task_from_delivery}
            add_task_to_delivery={this.props.add_task_to_delivery}
          />
        </Modal>

        <Modal show={this.state.isVisibleUploadModal} onHide={ e => this.handleHide(e, "isVisibleUploadModal") }>
          <UploadModal 
            add_delivery={this.props.add_delivery} 
            handle_file_upload={this.props.handle_file_upload}
            close_upload_modal={() => (this.setState({isVisibleUploadModal: false}))}
            />
        </Modal>

        <Modal show={this.state.isVisibleMessengersModal} onHide={ e => this.handleHide(e, "isVisibleMessengersModal") }>
          <MessengersModal/>
        </Modal>

      </div>
    );
  }
}