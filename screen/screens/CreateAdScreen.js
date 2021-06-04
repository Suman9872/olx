import React ,{useState} from 'react'
import { StyleSheet, Text, View,Alert  } from 'react-native'
import {TextInput, Button} from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'

const CreateAdScreen = () => {
    const [name,setName] = useState('')
    const [desc,setDesc] = useState('')
    const [year,setYear] = useState('')
    const [price,setPrice] = useState('')
    const [phone,setPhone] = useState('')
    const [Image,setImage] = useState('')
    
    const postData = async() =>{

      try {
        await firestore().collection('ads')
       .add({
        name,
        desc,
        year,
        price,
        phone,
        Image,
        uid:auth().currentUser.uid

       })
  Alert.alert('posted you add')

      } catch (error) {
        
        Alert.alert('somthing is wrong')
     
       
      }
    }

    const openCamera =()=>{
      launchImageLibrary({quality:0.5},(fileobj) =>{
       // console.log(fileobj)

      const uploadTask=  storage().ref().child(`/items/${Date.now()}`).putFile(fileobj.uri)
      uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progress == 100 ) {
          alert('uploaded')
        }
       
      }, 
      (error) => {
        alert('something is wrong')
      }, 
      () => {
        
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          setImage(downloadURL)
          
        });
      }
    );



      })
    }

    return (
        <View  style = {styles.container}>  
            <Text style ={styles.text}> Create Ad!</Text>

            <TextInput
              label="Create Ad!"
              value={name}
              mode='outlined'
              onChangeText={text => setName(text)} 
              
              />

            <TextInput
              label="Describe what you are selling"
              value={desc}
              mode='outlined'
              numberOfLines ={3}
              multiline ={true}
              onChangeText={text => setDesc(text)} 
              
              />

            <TextInput
              label="Year of purchase"
              value={year}
              mode='outlined'
              keyboardType='numeric'
              onChangeText={text => setYear(text)} 
              
              />

            <TextInput
              label="price in INR"
              value={price}
              mode='outlined'
              onChangeText={text => setPrice(text)} 
              
              />

            <TextInput
              label=" Your contact number"
              value={phone}
              mode='outlined'
              keyboardType = 'numeric'
              onChangeText={text => setPhone(text)} 
              
              />

             <Button icon='camera'   mode="contained" onPress={() => openCamera()}> 
             upload Image
            </Button>
            <Button disabled ={Image?false:true}   mode="contained" onPress={() => postData()}> 
             Post
            </Button>

        </View>
    )

};


const styles = StyleSheet.create({
    container: {
        flex:1,
        marginHorizontal:30,
        justifyContent:'space-evenly'
    },
    text:{
        fontSize:22,
        textAlign:'center'
    }
    
    });

export default CreateAdScreen


