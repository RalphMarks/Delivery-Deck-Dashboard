import React, { Component } from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';

export default class MyMap extends Component {
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

        {this.props.messengers.map(messenger => (
          <Marker key={messenger.id} position={messenger.position} />
        ))}
      </Map>
    );
  }
}
