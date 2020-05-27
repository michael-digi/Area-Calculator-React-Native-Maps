import React from "react";
import { Pedometer } from "expo-sensors";
import { StyleSheet, Text, View } from "react-native";
import { connect } from 'react-redux';
import styles from './Map.component.style.js';
import moment from 'moment'

class StepCounter extends React.Component {
  state = {
    isPedometerAvailable: "checking",
  };

  // componentDidMount() {
  //   this._subscribe();
  // }

  // componentWillUnmount() {
  //   this._unsubscribe();
  // }

  // _subscribe = () => {
  //   this._subscription = Pedometer.watchStepCount(result => {
  //     this.props.getCurrentStepCount(result.steps)
  //   });

  //   Pedometer.isAvailableAsync().then(
  //     result => {
  //       this.setState({
  //         isPedometerAvailable: String(result)
  //       });
  //     },
  //     error => {
  //       this.setState({
  //         isPedometerAvailable: "Could not get isPedometerAvailable: " + error
  //       });
  //     }
  //   );

  //   const end = new Date();
  //   const start = new Date();
  //   start.setDate(end.getDate() - 1);
    
  //   Pedometer.getStepCountAsync(start, end).then(
  //     result => {
  //       this.props.getPastStepCount(result.steps)
  //     },
  //     error => {
  //       this.setState({
  //         pastStepCount: "Could not get stepCount: " + error
  //       });
  //     }
  //   );
  // };

  // _unsubscribe = () => {
  //   this._subscription && this._subscription.remove();
  //   this._subscription = null;
  // };

  render() {
    return (
      <View style={styles.stepContainer}>
        <Text>
          Your steps to spend: {this.props.curStepCount.curStepCount}
        </Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  curStepCount: state.curStepCount
})

export default connect(mapStateToProps)(StepCounter)