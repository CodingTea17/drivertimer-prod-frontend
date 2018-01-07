import React, { Component } from 'react';
import Sound, { soundManager } from 'react-sound';
import Clock from './Clock';
import notification from './notification_sound.mp3';
import ActionCable from 'actioncable';

class Driver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      last_message: {},
      driver: this.props.driver,
      store_number: this.props.storeNumber,
      play_sound: false,
    };
  }

  componentDidMount() {
    soundManager.setup({ ignoreMobileRestrictions : true });
    window.fetch(`https://drivertimer-api.herokuapp.com/api/stores/${this.state.store_number}/drivers/${this.state.driver.id}/last_message`).then(data => {
      data.json().then(last_message => {
        if (last_message) {
          const estimatedReturnTime = Date.parse(last_message.message_timestamp) + (last_message.text * 60 * 1000);
          // console.log("est Time:", (new Date(estimatedReturnTime)).toUTCString());
          // console.log("sent Time:", (new Date(last_message.message_timestamp).toUTCString()));
          this.setState({
            last_message,
            estimatedReturnTime
            });
        }
      })
    })
    const cable = ActionCable.createConsumer('wss://drivertimer-api.herokuapp.com/cable')
    this.sub = cable.subscriptions.create({channel: 'DriverMessagesChannel', store: this.state.store_number, driver: this.state.driver.id}, {
      received: this.handleReceiveNewDriverMessage
    })
  }

  handleReceiveNewDriverMessage = ({ new_message }) => {
    if (new_message.driver_id === this.state.driver.id ) {
      // Currently here to ensure the sound is stopped. Keeps the application from skipping a message due to back-to-back messages
      this.setState({ play_sound: false })
      const estimatedReturnTime = Date.parse(new_message.message_timestamp) + (new_message.text * 60 * 1000);
      this.setState({
        estimatedReturnTime,
        last_message: new_message,
        play_sound: true
      })
      // DEPRECIATED: it would use the driver id to then make ANOTHER fetch for the actual message? What was I thinking haha
      // window.fetch(`/api/messages/${new_driver_message.message_id}`).then(data => {
      //   data.json().then(new_message => {
      //     const estimatedReturnTime = Date.parse(new_message.message_timestamp) + (new_message.text * 60 * 1000);
      //     this.setState({
      //       estimatedReturnTime,
      //       last_message: new_message,
      //       play_sound: true
      //     })
      //   })
      // })
    }
  }

  hasNotified = () => {
    this.setState({ play_sound: false })
  }

  render() {
    return (
      <div>
        <h2>{ this.state.driver.name }</h2>
        { this.state.play_sound && <Sound
                                      url={ notification }
                                      playStatus={ Sound.status.PLAYING }
                                      onFinishedPlaying={ this.hasNotified }
                                    />
        }

        <Clock
          returnTime={ new Date(this.state.estimatedReturnTime) }
          sentTime={ new Date(this.state.last_message.message_timestamp) }
        />
      </div>
    );
  }
}

export default Driver;
