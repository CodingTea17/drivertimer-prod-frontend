import React, { Component } from 'react';
import Store from './Store.js';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class Home extends Component {
  constructor() {
    super();
    this.state = {
      stores: [],
      center: {lat: 39.4879424, lng: -118.435933},
      zoom: 5.84
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
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.MAPS_API_KEY,
            language: 'en',
          }}
          defaultCenter={this.state.center}
          defaultZoom={this.state.zoom}
        >
          <AnyReactComponent
            lat={59.955413}
            lng={30.337844}
            text={'Kreyser Avrora'}
          />
        </GoogleMapReact>
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
