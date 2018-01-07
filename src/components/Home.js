import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { List, Segment } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom';
import Store from './Store.js';

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
    options={{gestureHandling: "greedy"}}
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
        <Segment inverted>
          <List divided inverted relaxed size="huge">
            {
              this.state.stores.map((store, index) => (
                <List.Item key={store.id}>
                  <NavLink
                    to={`/stores/${store.store_number}`}
                    activeClassName='is-active'
                  >
                    <List.Header>
                      <List.Icon name='marker' />
                      { store.store_number }
                    </List.Header>
                    <List.Description>
                      { store.address }
                    </List.Description>
                  </NavLink>
                </List.Item>
              ))
            }
          </List>
        </Segment>
      </div>
    );
  }
}

export default Home;
