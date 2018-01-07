import React, { Component } from 'react';
import { Icon, Sidebar, Menu, Segment, Grid, Button, Modal, Form } from 'semantic-ui-react'

import Driver from './Driver';

// const driverStyle = {
//   width: '33%'
// };

const menuStyles = {
  borderRadius: "0",
  margin: "0",
  // backgroundColor: '#b71c1c'
}

const sideBarStyles = {
  minHeight: "100vh",
  margin: "0",
  border: "0",
  borderRadius: "0"
}

class StoreHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      drivers: [],
      store_number: this.props.match.params.id,
      form: {},
      modalOpen: false
    };
  }

  componentDidMount() {
    window.fetch(`https://drivertimer-beta.herokuapp.com/api/stores/${this.state.store_number}/drivers`).then(data => {
      data.json().then(res => {
        this.setState({ drivers: res })
      })
    })
  }

  updateDriverList(response) {
      window.fetch(`https://drivertimer-beta.herokuapp.com/api/stores/${this.state.store_number}/drivers`).then(data => {
        data.json().then(res => {
          this.setState({ drivers: res })
        });
      });
  }

  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible });
  }

  handleOpen = () => {
    this.setState({ modalOpen: true })
  }

  handleClose = () => {
    this.setState({ modalOpen: false })
  }

  handleDeleteDriver = (driver_id) => {
    fetch(`https://drivertimer-beta.herokuapp.com/api/stores/${this.state.store_number}/drivers/${driver_id}`,
    {
      headers: {
	     'Access-Control-Allow-Origin': '*'
	    },
      method: 'DELETE'
    })
    .then((response) => {
      // Wait for a response before updating the list to make sure the server has finished
      if (response.status === 200 || response.status === 0) {
        this.updateDriverList();
        this.handleClose();
      }
    });
  }

  updateFormState = (e) => {
    const valueName = e.target.name;
    const newValue = e.target.value;
    this.setState({
      form: {
        ...this.state.form,
        ...{[valueName] : newValue}
      }
    });
  }

  handleAddDriver = (event) => {
    event.preventDefault();

    fetch(`https://drivertimer-beta.herokuapp.com/api/stores/${this.state.store_number}/drivers`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
          name: this.state.form['name'],
          phone_number: `1${this.state.form['phone_number']}`
      })
    })
    .then((response) => {
      // Wait for a response before updating the list to make sure the server has finished
      if (response.status === 200 || response.status === 0) {
        this.updateDriverList();
      }
    });
  }

  render() {
    const { visible } = this.state;
    return (
      <div style={ {textAlign: "center"} }>
        <Menu
          inverted
          borderless={ true }
          style={ menuStyles }
        >
          <Menu.Item>
            <Icon
              onClick={ this.toggleVisibility }
              inverted
              name='bars'
              size="big"
            />
          </Menu.Item>
          <Menu.Item>
            <h1>Store { this.state.store_number }</h1>
          </Menu.Item>
        </Menu>
        <Sidebar.Pushable as={ Segment } style={ sideBarStyles }>
          <Sidebar
            as={ Menu }
            animation='scale down'
            width='thin'
            visible={ visible }
            icon='labeled'
            vertical
            inverted
          >
            <Menu.Item name='newdriver'>
              <Modal
                trigger={<Button fluid inverted onClick={ this.handleOpen }>Add Driver</Button>}
                open={ this.state.modalOpen }
                onClose={ this.handleClose }
              >
                <Modal.Header style={ {textAlign: "center"} }>Add New Driver</Modal.Header>
                <Modal.Content>
                  <Modal.Description>
                    <Form
                      size="huge"
                      onSubmit={this.handleAddDriver}
                    >
                      <Form.Group widths='equal'>
                        <Form.Field onChange={ this.updateFormState } name="name" label='Name' control='input' placeholder='Name' />
                        <Form.Field onChange={ this.updateFormState } name="phone_number" label='Phone Number' control='input' placeholder='(555) 555-5555' />
                      </Form.Group>
                      <Button
                        fluid
                        inverted
                        color='green'
                        size="big"
                        type='submit'
                      >
                        Submit
                      </Button>
                    </Form>
                  </Modal.Description>
                </Modal.Content>
              </Modal>
            </Menu.Item>
            <div style={ {overflow: "auto"} }>
              {
                (this.state.drivers && this.state.drivers.length) && this.state.drivers.map((driver, index) => (
                  <Menu.Item key={ driver.id }>
                    <Button
                      fluid
                      animated
                      inverted
                      color='red'
                      onClick={ () => this.handleDeleteDriver(driver.id) }
                    >
                      <Button.Content visible>{driver.name}</Button.Content>
                      <Button.Content hidden>
                        Delete
                      </Button.Content>
                    </Button>
                  </Menu.Item>
                ))
              }
            </div>
          </Sidebar>
          <Sidebar.Pusher>
            <Grid stackable columns={ 4 } style={ {marginTop: "0px"} }>
              <Grid.Row>
                {
                  // Make sure there are any drivers for the store
                  // TODO: It would be cool to render an example driver or something if a store has no drivers
                  (this.state.drivers && this.state.drivers.length) && this.state.drivers.map((driver, index) => (
                    <Grid.Column key={ driver.id }>
                      <Driver
                        driver={ driver }
                        storeNumber={ this.state.store_number }
                        count={ index + 1 }
                      />
                    </Grid.Column>
                  ))
                }
              </Grid.Row>
            </Grid>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default StoreHome;


// <div style={ {backgroundColor: '#b71c1c', height: '4em', color: 'white'} }>
//   <p style={ {height: '100%', fontSize: '3em', fontWeight: '800', paddingBottom: '0.5px'} }>Your Drivers</p>
// </div>
