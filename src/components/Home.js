import React, { Component } from 'react';
import Store from './Store.js';
import { Redirect } from 'react-router';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

const MapWithAMarker = withScriptjs(withGoogleMap(props =>
  <GoogleMap
    defaultZoom={5}
    defaultCenter={{ lat: 40.6796862, lng: -121.5388716 }}
  >
    {
      props.stores.map((store, index) => (
        <Marker
          onClick={() => {props.onMarkerClick(store.store_number)}}
          position={{ lat: store.latitude, lng: store.longitude }}
          key={store.id}
        />
      ))
    }
  </GoogleMap>
));

class Home extends Component {
  constructor() {
    super();
    this.state = {
      stores: [],
      redirect_to: "",
      redirect: false,
    };
  }

  componentDidMount() {
    window.fetch('https://drivertimer-api.herokuapp.com/api/stores').then(data => {
      data.json().then(res => {
        this.sortAndSet(res);
        this.setState({ stores: res })
      })
    })
  }

  sortAndSet = (storesData) => {
    storesData.sort(function(a, b) {
      return parseInt(a.store_number, 10) - parseInt(b.store_number, 10);
    })
  }

  handleMarkerClick = (store_number) => {
    this.setState({
      redirect_to: store_number,
      redirect: true,
    });
  }

  render() {
    const API_KEY = process.env.MAPS_API_KEY

    if (this.state.redirect) {
      return <Redirect push to={`/stores/${this.state.redirect_to}`} />;
    }

    return (
      <div>
        <MapWithAMarker
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          stores={this.state.stores}
          onMarkerClick={this.handleMarkerClick}
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
