import React, { Component } from 'react';
import { View, Dimensions, StatusBar, ActivityIndicator, Text, StyleSheet } from 'react-native';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import { Color } from '../global/util';
 
let { width, height } = Dimensions.get('window');

class Loading extends Component {

    render() {
        let loading = this.props.loading;
        if(!loading.show)
            return null;
        return (
            <View style={{
                position : 'absolute',
                top : 0,
                left : 0,
                height,
                width,
                zIndex : 999,
                justifyContent : 'center',
                alignItems : 'center',
                backgroundColor : "rgba(52, 52, 52, 0.6)"
            }}>
                <View style={{
                    justifyContent : 'center',
                    alignItems : 'center',
                    borderWidth : 1,
                    width : 200,
                    height : 120,
                    borderColor : Color.themeColor,
                    borderRadius : 4
                }}>
                    <ActivityIndicator size="large" color={Color.themeColor} />
                    <Text style={{ marginTop : 10, fontSize : 18, color : Color.themeColor }}>
                        LOADING ....
                    </Text>
                </View>
            </View>
        );
    }
  }

  function mapStateToProps(state, props) {
    return {
        loading : state.testReducer.loading
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(Loading);
