import React, {Component}  from 'react';
import { View, Text, Dimensions, TouchableOpacity, StatusBar } from "react-native";
import { Color } from "./../global/util";
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import { setData } from "./../redux/action";
import GradientView from './gradientView';
const width = Math.round(Dimensions.get('window').width);  
const height = Math.round(Dimensions.get('window').height);  


class ErrorModal extends Component{
    render(){
        let errorModalInfo = this.props.errorModalInfo || {};
        if(!errorModalInfo.showModal)
            return null;
        errorModalInfo.title = errorModalInfo.title || "ALERT";
        errorModalInfo.message = errorModalInfo.message || "This is a message";
        errorModalInfo.buttonText = errorModalInfo.buttonText || "OK";
        errorModalInfo.onClose = errorModalInfo.onClose ? errorModalInfo.onClose : () => this.props.setData({ errorModalInfo: { showModal : false }});
        return (
            <View style={{ 
                position : 'absolute', 
                backgroundColor : "rgba(52, 52, 52, 0.6)",
                justifyContent : 'center',
                alignItems : 'center',
                zIndex : 999,
                top : 0,
                left : 0,
                height,
                width,
                marginTop : StatusBar.currentHeight
            }}>
                <View style={{ width: width - 48, borderRadius: 8, backgroundColor : 'white', justifyContent : 'center', alignItems : 'center', padding: 16 }}>
                    <Text style={{ fontSize : 18, fontWeight : 'bold' }}>
                        { errorModalInfo.title }
                    </Text>
                    <Text style={{ fontSize : 16, textAlign : 'center', marginTop : 10  }}>
                        { errorModalInfo.message }
                    </Text>
                    <TouchableOpacity
                        style={{
                            justifyContent : 'center',
                            marginTop : 20,
                            marginBottom : 5,
                            height : 36,
                            width : '100%',
                            borderRadius : 4
                        }}
                        onPress={e => {
                            errorModalInfo.onClose();
                        }}
                    >
                    <GradientView h={36} w={width - 72}>
                        <Text style={{ fontSize : 14, color : Color.themeFontColor, fontWeight: 'bold', textAlign : 'center' }}>
                            { errorModalInfo.buttonText }
                        </Text>
                    </GradientView>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        errorModalInfo : state.testReducer.errorModalInfo
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      setData
    }, dispatch);
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(ErrorModal);