import React from 'react';
import { Container, Row, Col, Image,Button } from 'react-bootstrap';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
//import { parse } from 'postcss';
import L from 'leaflet';
import client from '../../feathers';
import './../../css/Tracking/index.css';
import {faPhone, faComments } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const blueMarker = new L.Icon({
  iconUrl: require('./icons/blue-marker.png'),
  iconAnchor: [0, 0],
  popupAnchor: [0, 0],
  iconSize: [20, 29],
});

export const messengerMarker = new L.Icon({
  iconUrl: require('./icons/messenger-marker.png'),
  iconAnchor: [0, 0],
  popupAnchor: [0, 0],
  iconSize: [16, 20],
});

export default class TrackingPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      task: {attrs:{
        lat:0,
        lng:0,
      }},
      messenger:{
        location:{
          latitude:0,
          longitude:0,
        }
      },
    };
  }

  componentDidMount(){
    const trackingCode = this.props.match.params.tracking_code.split('+');

    client.service('messenger_with_locations')
    .get(trackingCode[1])
    .then((messenger) => {
      this.setState({messenger: messenger[0]});
    })
    .catch( error => console.log(error));

    client.service('tasks')
    .get(trackingCode[0])
    .then((task) => {
      this.setState({task: task});
    })
    .catch( error => console.log(error));


    client.service('locations').on('patched', (updatedLocation) => {
      if(this.state.messenger.locationId === updatedLocation.id){
        let messenger = this.state.messenger;
        messenger['location'] = updatedLocation;
        this.setState({messenger: messenger });
      }
    });

  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row" style={{marginTop:'16px'}}>
          <div className="col-12">
            <Map
                center={[parseFloat(this.state.task.attrs.lat), parseFloat(this.state.task.attrs.lng)]}
                zoom="14"
                style={{ height: '50vh', zIndex: '0', backgroundColor: '#2B3237' }}
              >
                <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFwaGFlbGZqIiwiYSI6ImNqbWd5NThjbTB3djkza252N3d0YWZldXgifQ.pdHTggRDWd3ftNjvTQmYtg"
                />

                <Marker
                  icon={blueMarker} 
                  key={this.state.task.id} 
                  position={{"lat": parseFloat(this.state.task.attrs.lat), "lng": parseFloat(this.state.task.attrs.lng)}}
                >
                </Marker>

                <Marker
                  icon={messengerMarker} 
                  key={this.state.messenger.id} 
                  position={{"lat": parseFloat(this.state.messenger.location.latitude), "lng": parseFloat(this.state.messenger.location.longitude)}}
                >
                </Marker>

              </Map>
            </div>
        </div>
        <div className="row" style={{marginTop: '24px'}}>
          <div className="col-12 tracking__addressRow">
            <p className="tracking__title">Mensajero:</p>
          </div>
          <div className="col-12 tracking__addressRow">
            <p className="tracking__address">{this.state.messenger.name}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-12 tracking__addressRow">
            <p className="tracking__title">Entrega:</p>
          </div>
          <div className="col-12 tracking__addressRow">
            <p className="tracking__address">{this.state.task.attrs.address}</p>
          </div>
        </div>
        <div className="row" style={{marginTop: '24px', marginBottom: '16px'}}>
          <div className="col-6">
            <a href={"tel:"+this.state.messenger.phone} className="btn tracking__btn">
              <FontAwesomeIcon size="1x" icon={faPhone} color="white"/>
            </a>
          </div>
          <div className="col-6">
            <a href={"sms:"+this.state.messenger.phone+"?body=hello"} className="btn tracking__btn">
            <FontAwesomeIcon size="1x" icon={faComments} color="white"/>
            </a>
          </div>
        </div>
      </div>
    );
  }
}