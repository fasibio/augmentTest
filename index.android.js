/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid
} from 'react-native';

import {AugmentReact, AugmentReactPlayer} from 'react-native-augment'

AugmentReact.init({
  id:  "357fee36746668573ceb2f5957c4869ee1a62a112639bac9b0fae43c7c431692",
  key: "80ae1420e164e0440d5329067bcdd953e9fa6c63b75c001c06d169a4f11268c5",
  vuforia: "Dl5pzxoca2JxLcYxBJ2pIeIE4dNcK0etMeb1746L7lq6vSFen43cS7P1P/HXjwHtUouV5Xus2U0F7WHUTKuO629jKFO13fBQczuY52UJcSEhsu9jHPMaupo5CpqQT3TFTQjlhzHhVXiVMEqq7RI+Edwh8TCSfGAbNRdbIELTfK+8YDYqwEHDbp62mFrs68YnCEQZDrpcLyC8WzFCVZtnUq3Cj3YBUfQ6gNnENYiuLf06gAAF/FcaF65VYveGRBbp3hpkqolX28bxPiUYNVknCSFXICPHciVntxF+rcHW5rrX7Cg/IVFGdNRF",
})

const productJson1 = {
  identifier: "84",
  brand: "Whirlpool",
  name: "Fridge",
  ean: ""
}



export default class augmentTest extends Component {

  constructor(props){
    super(props)
    this.state = {
      cameraPermission: false

    }
    AugmentReact.checkIfModelDoesExistForUserProduct(productJson1)
      .then(function (augmentReactProduct) {
        // Check if the Augment API found a corresponding Product
        if (!augmentReactProduct) {
          alert('Product not found');
          return;
        }

        // We have the augmentReactProduct here :)
        console.log('We have the augmentReactProduct here :)' ,augmentReactProduct);

      })
      .catch(function (error) {
        // Error is a JSON object {error: string}
        alert(error.error);
      });
  }

  _loaderCallback(loaderStatus){
    console.log('loaderStatus', loaderStatus);
    this.setState({
      loaderShow: loaderStatus.show,
      loaderText: "Loading " + loaderStatus.progress + "%"
    });
  }

  _onPlayerReady(player, error){
    if (error) {
      console.error(error);
      return;
    }

    this.playerInstance = player;
    player.addProduct(productJson1)
      .then((da) => {
        console.log("The product has been added to the ARView", da);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    if (!this.state.cameraPermission){
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then((granted) => {
        if (granted === 'granted'){
          console.log('juhu we have permission')
          this.setState({
            cameraPermission: true
          })
        }
      })
      return <View>
        <Text>WAIT WAIT For permission</Text>

      </View>
    }

    return (
      <View style={styles.container}>
        <AugmentReactPlayer
          style={styles.arStyle}
          onPlayerReady={this._onPlayerReady.bind(this)}
          loaderCallback={this._loaderCallback.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  arStyle: {
    height: 600,
    width: 400,

  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,

  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('augmentTest', () => augmentTest);
