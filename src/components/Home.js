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
    defaultZoom={4}
    defaultCenter={{ lat: 39.8984293, lng: -117.8050728 }}
  >
    {console.log(props.stores)}
    <Marker
      position={{ lat: 39.8984293, lng: -117.8050728 }}
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
    console.log(process.env.MAPS_API_KEY)
    window.fetch('https://drivertimer-api.herokuapp.com/api/stores').then(data => {
      data.json().then(res => {
        this.setState({ stores: res })
      })
    })
  }

  render() {
    const API_KEY = process.env.MAPS_API_KEY
    return (
      <div>
        <MapWithAMarker
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          stores={"a lot"}
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
