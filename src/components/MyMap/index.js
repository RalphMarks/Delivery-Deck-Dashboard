import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
//import { parse } from 'postcss';
import L from 'leaflet';


// ? Function to display messengers
//{this.props.messengers.map(messenger => (
//  <Marker key={messenger.id} position={messenger.position} />
//  ))}


export const greyMarker = new L.Icon({
  iconUrl: require('./icons/grey-marker.png'),
  iconAnchor: [0, 0],
  popupAnchor: [0, 0],
  iconSize: [20, 29],
});

export const purpleMarker = new L.Icon({
  iconUrl: require('./icons/purple-marker.png'),
  iconAnchor: [0, 0],
  popupAnchor: [0, 0],
  iconSize: [20, 29],
});

export const blueMarker = new L.Icon({
  iconUrl: require('./icons/blue-marker.png'),
  iconAnchor: [0, 0],
  popupAnchor: [0, 0],
  iconSize: [20, 29],
});

export const activeMessenger = new L.Icon({
  iconUrl: require('./icons/active-messenger.png'),
  iconAnchor: [ 0, 0],
  popupAnchor: [0, 0],
  iconSize: [16, 20],
});

export const depot = new L.Icon({
  iconUrl: require('./icons/depot.png'),
  iconAnchor: [ 0, 0],
  popupAnchor: [0, 0],
  iconSize: [16, 20],
});

export const depotT = new L.Icon({
  iconUrl: require('./icons/house.svg'),
  iconAnchor: [ 0, 0],
  popupAnchor: [0, 0],
  iconSize: [16, 20],
});


const Depot = ({company}) => (
  <Marker 
    icon={depotT} 
    key={company.id} 
    position={{"lat": parseFloat(company.attrs.lat), "lng": parseFloat(company.attrs.lng)}}> 
  </Marker>
);
export default class MyMap extends Component {

  getIcon(state){
    switch (state) {
      case 0:
        return greyMarker;
      case 1:
        return purpleMarker;
      case 2:
        return blueMarker;
      default:
        return greyMarker;
    }
  }

  render() {
    return (
      <Map
        center={[19.43, -99.17]}
        zoom="14"
        style={{ height: '100vh', zIndex: '0', backgroundColor: '#2B3237' }}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFwaGFlbGZqIiwiYSI6ImNqbWd5NThjbTB3djkza252N3d0YWZldXgifQ.pdHTggRDWd3ftNjvTQmYtg"
        />

        {this.props.messengers.map(messenger => {
          let marker;
          if (messenger.on_duty) {
            marker = <Marker  
              onMouseOver={(e) => {
                e.target.openPopup();
              }}

              onMouseOut={(e) => {
                e.target.closePopup();
              }}

              icon={activeMessenger} 
              key={messenger.id} 
              position={{"lat": parseFloat(messenger.location.latitude), "lng": parseFloat(messenger.location.longitude)}}
            >
              <Popup>{messenger.name}</Popup>
            </Marker> 
          }
          return marker;
        })}

        {this.props.messengers.map((messenger) => (
          messenger.deliveries.map((delivery) => (
            delivery.tasks.map(task => {
              const numberAndStreet = task.attrs.address.split(',');

              return (<Marker 
    
              onMouseOver={(e) => {
                e.target.openPopup();
              }}
    
              onMouseOut={(e) => {
                e.target.closePopup();
              }}
    
              icon={this.getIcon(task.state)} 
              key={task.id} 
              position={{"lat": parseFloat(task.attrs.lat), "lng": parseFloat(task.attrs.lng)}}> 
    
                <Popup>{numberAndStreet[0]} <br/> <b>{task.attrs.recipient}</b></Popup>
    
              </Marker>);
            })
          ))
        ))}



        {this.props.deliveries.map((delivery) => (
          delivery.tasks.map(task => {
            const numberAndStreet = task.attrs.address.split(',');

            return (<Marker 
  
            onMouseOver={(e) => {
              e.target.openPopup();
            }}
  
            onMouseOut={(e) => {
              e.target.closePopup();
            }}
  
            icon={this.getIcon(task.state)} 
            key={task.id} 
            position={{"lat": parseFloat(task.attrs.lat), "lng": parseFloat(task.attrs.lng)}}> 
  
              <Popup>{numberAndStreet[0]} <br/> <b>{task.attrs.recipient}</b></Popup>
  
            </Marker>);
          })
        ))}

        
      {this.props.company.attrs !== undefined ? <Depot company={this.props.company}/> : null }

      </Map>
    );
  }
}
