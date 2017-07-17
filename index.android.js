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
  PermissionsAndroid,
  Picker,
  TouchableHighlight,
} from 'react-native';

import {AugmentReact, AugmentReactPlayer} from 'react-native-augment'

AugmentReact.init({
  id:  "357fee36746668573ceb2f5957c4869ee1a62a112639bac9b0fae43c7c431692",
  key: "80ae1420e164e0440d5329067bcdd953e9fa6c63b75c001c06d169a4f11268c5",
  vuforia: "ATQqCM7/////AAAAGXLs+GRi0UwXh0X+/qQL49dbZGym8kKo+iRtgC95tbJoCWjXXZihDl5pzxoca2JxLcYxBJ2pIeIE4dNcK0etMeb1746L7lq6vSFen43cS7P1P/HXjwHtUouV5Xus2U0F7WHUTKuO629jKFO13fBQczuY52UJcSEhsu9jHPMaupo5CpqQT3TFTQjlhzHhVXiVMEqq7RI+Edwh8TCSfGAbNRdbIELTfK+8YDYqwEHDbp62mFrs68YnCEQZDrpcLyC8WzFCVZtnUq3Cj3YBUfQ6gNnENYiuLf06gAAF/FcaF65VYveGRBbp3hpkqolX28bxPiUYNVknCSFXICPHciVntxF+rcHW5rrX7Cg/IVFGdNRF",
})

const productJson = [
  {
    identifier: "84",
    brand: "Whirlpool",
    name: "Fridge",
    ean: "",
  },
  {
    identifier: "98",
    brand: "Nintendo",
    name: "Switch",
    ean: "",
  },
  {
    identifier: "81",
    brand: "Samsung",
    name: "TV",
    ean: "",
  },
]






export default class augmentTest extends Component {

  constructor(props){
    super(props)
    this.state = {
      loaderShow: true,
      loaderText: "Loading 0%",
      product: productJson[0],
      selectedValue: "0"
    }

    AugmentReact.checkIfModelDoesExistForUserProduct(this.state.product)
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
    player.addProduct(this.state.product)
      .then((da) => {
        console.log("The product has been added to the ARView", da);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _renderPicker(){
    const pickerItem = productJson.map((one, index) => {
      return <Picker.Item key={index} label={one.brand + " " + one.name} value={'' + index}/>
    })
    return <View>
      <Text>YAY</Text>
      <Picker
        style={styles.picker}
        selectedValue={this.state.selectedValue}
        onValueChange={(itemValue, itemIndex) => {
          this.setState({
            selectedValue: itemValue
          })
          //@TODO Remove reset current Products How TO ????????? _________________________________________________________
         this.playerInstance.addProduct(productJson[itemValue])
        }}
      >
        {pickerItem}
      </Picker>

    </View>
  }

  render() {
    let loading = (
      <TouchableHighlight
        onPress={() => {
          this.playerInstance.recenterProducts()
        }}
      >
        <Text>ReCenter</Text>
      </TouchableHighlight>)
    if (this.state.loaderShow){
       loading = (<View>
        <Text>{this.state.loaderText}</Text>
      </View>)
    }
    return (
      <View style={styles.container}>
        {this._renderPicker()}
        {loading}
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
  picker: {
  },
  arStyle: {
    height: 600,
    width: 400,

  },
  container: {
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
