import React from 'react';
import PropTypes from 'prop-types';

import {View,Text,Image,StyleSheet, TouchableOpacity,PanResponder,Animated,Dimensions,Button, Linking} from 'react-native';
import {priceDisplay} from '../util';
import ajax from '../ajax';

class DealDetail extends React.Component {
imageXPos = new Animated.Value(0);

  imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder:()=>true,
    onPanResponderMove:(evt,gs)=>{
      this.imageXPos.setValue(gs.dx);
    },
    onPanResponderRelease:(evt,gs)=>{
      this.width = Dimensions.get('window').width;
      if(Math.abs(gs.dx) > this.width*0.4){
        const direction = Math.sign(gs.dx)
        //-1 for left swipe, 1 for right swipe
        Animated.timing(this.imageXPos,{
          toValue:direction*this.width,
          duration:250,
        }).start(()=>this.handleSwipe(-1*direction));
      }else{
        Animated.spring(this.imageXPos,{
          toValue:0
        }).start();
      }
    }
  });
  handleSwipe=(indexDirection)=>{
    if(!this.state.deal.media[this.state.imageIndex+indexDirection]){
      Animated.spring(this.imageXPos,{
        toValue:0,
      }).start();
      return;
    }
    this.setState((prevState)=>({
      imageIndex:prevState.imageIndex+indexDirection
    }),
    ()=>{
      //next image animation
      this.imageXPos.setValue(indexDirection*this.width);
      Animated.spring(this.imageXPos,{
        toValue:0,
      }).start();
    });
  }

    static propTypes ={
        initialDealData :PropTypes.object.isRequired,
        onBack:PropTypes.func.isRequired,
    };
    state={
        deal : this.props.initialDealData,
        imageIndex:1,
    };
    async componentDidMount(){
        const fullDeal = await ajax.fetchDealDetail(this.state.deal.key);
        this.setState({
            deal:fullDeal,
        });
    }
    openDealUrl=()=>{
      Linking.openURL(this.state.deal.url)
    }
    render(){
        const {deal} = this.state;
        return(
            <View  style={styles.dealstyle}>
                 <TouchableOpacity style={styles.backLink} onPress={this.props.onBack}>
                        <Text  style={styles.backLinkText}>Back</Text>
                    </TouchableOpacity>
                <Animated.Image 
                {...this.imagePanResponder.panHandlers}
                source={{uri: deal.media[this.state.imageIndex]}}
                style={[{left:this.imageXPos},styles.image]}
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
               <Button title="Buy this deal!" onPress={this.openDealUrl}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
  dealstyle:{
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
        marginLeft:10,
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
})
export default DealDetail;