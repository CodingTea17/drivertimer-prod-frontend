import React, { Component } from 'react';
import Store from './Store.js';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

const MapWithAMarker = withScriptjs(withGoogleMap(props =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    <Marker
      position={{ lat: -34.397, lng: 150.644 }}
    />
  </GoogleMap>
));

class Home extends Component {
  constructor() {
    super();
    this.state = {
      stores: [],
    };
  }

  componentDidMount() {
    window.fetch('https://drivertimer-api.herokuapp.com/api/stores').then(data => {
      data.json().then(res => {
        this.setState({ stores: res })
      })
    })
  }

  render() {
    return (
      <div>
        <MapWithAMarker
          googleMapURL=`https://maps.googleapis.com/maps/api/js?key=${process.env.MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
        {
          this.state.stores.map((store, index) => (
            <Store
              key={store.id}
              store={store}
              count={index + 1}
            />
          ))
        }
      </div>
    );
  }
}

export default Home;
