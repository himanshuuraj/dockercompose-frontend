import React from 'react';
import { Text } from 'react-native';

export default (props) => {
    let {s, c, b, t, lh, center, style, ...rest} = props
    c = c || "#4a4a4a";

    let st = { 
      ...{
        color : c,
        fontSize : s,
        lineHeight : lh,
        fontWeight: b ? 'bold' : undefined,
        textAlign : center ? 'center' : undefined
      }, ...style};


    return (
      <Text {...rest} style={st}>
          {t}
      </Text>
    );
}