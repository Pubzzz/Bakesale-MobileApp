import React from 'react';
import PropTypes from 'prop-types';

import {View,Text,Image,StyleSheet, TouchableOpacity} from 'react-native';
import {priceDisplay} from '../util';
import ajax from '../ajax';

class DealDetail extends React.Component {
    static propTypes ={
        initialDealData :PropTypes.object.isRequired,
        onBack:PropTypes.func.isRequired,
    };
    state={
        deal : this.props.initialDealData,
    };
    async componentDidMount(){
        const fullDeal = await ajax.fetchDealDetail(this.state.deal.key);
        this.setState({
            deal:fullDeal,
        });
    }
    render(){
        const {deal} = this.state;
        return(
            <View  style={styles.dealstyle}>
                 <TouchableOpacity style={styles.backLink} onPress={this.props.onBack}>
                        <Text  style={styles.backLinkText}>Go Back</Text>
                    </TouchableOpacity>
                <Image source={{uri: deal.media[0]}}
                style={styles.image}
                />
                <View  style={styles.info}>
                <Text  style={styles.title}>{deal.title}</Text>
                <View style={styles.footer}>
                     {/* <Text style={styles.cause}>{deal.cause.name}</Text> */}
                     <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
                </View>
                </View>
                {deal.user && (
                    <View style={styles.user}>
                    <Image source={{uri:deal.user.avatar}} style={styles.avatar}/>
                    <Text>{deal.user.name}</Text>
                </View>
                )}
                <View style={styles.detail}>
                    <Text>{deal.description}</Text>
                </View>
               
            </View>
        );
    }
}
const styles = StyleSheet.create({
    dealstyle:{
        marginHorizontal:20,
        marginTop:50,
    },
      backLink: {
        marginBottom: 5,
        color: '#22f',
        marginLeft: 10,
      },
      backLinkText:{
        color:'#22f',
        fontSize:20,
        fontWeight:'bold',
      },
      image: {
        width: '100%',
        height: 150,
        backgroundColor: '#ccc',
      },
      title: {
        fontSize: 16,
        padding: 10,
        fontWeight: 'bold',
        backgroundColor: 'rgba(237, 149, 45, 0.4)',
      },
      footer: {
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems:'center',
        marginTop: 15,
      },
      info: {
        alignItems: 'center',
      },
      user: {
        alignItems: 'center',
      },
      cause: {
        marginVertical: 10,
      },
      price: {
        fontWeight: 'bold',
      },
      avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
      },
      detail: {
        borderColor:'#bbb',
        borderWidth:1,
          paddingTop:10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderStyle: 'dotted',
        margin: 10,
        padding: 10,
        fontSize:25,
      },
})
export default DealDetail;