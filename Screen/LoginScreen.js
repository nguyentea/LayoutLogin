
import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Loader from './Components/Loader';
import DrawerNavigatorRoutes from './DrawerNavigationRoutes';
import HomeScreen from './DrawerScreens/HomeScreen';

const LoginScreen = ({navigation}) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const passwordInputRef = createRef();

  const handleLogin2 = async () => {
    try {
      const response = await fetch('http://192.168.1.96:8888/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userEmail,
          password: userPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        
          // Đăng nhập thành công
          Alert.alert(data.username, data.permissions);
          //navigation.navigate(HomeScreen);
        
      } else {
        // Xử lý lỗi từ máy chủ
        Alert.alert('Error', 'Server error, please try again later');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };


    const handleLogin = async () => {
    console.log(123213);
    try {
      
      const axios = require('axios');
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      var raw = JSON.stringify({
        "username": userEmail,
        "password": userPassword
      });
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      fetch("http://192.168.0.105:8888/login", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  const handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    setLoading(true);
    let dataToSend = {user_email: userEmail, user_password: userPassword};
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch('http://192.168.0.105:8888/login', {
      method: 'POST',
      body: formBody,
      headers: {
        //Header Defination
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        //'Content-Type': 'application/json'
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.status == 1) {
          AsyncStorage.setItem('user_id', responseJson.data[0].user_id);
          console.log(responseJson.data[0].user_id);
          navigation.replace('DrawerNavigationRoutes');
        } else {
          setErrortext('Please check your email id or password');
          console.log('Please check your email id or password');
        }
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../Image/aboutreact.png')}
                style={{
                  width: '100%',
                  height: 200,
                  resizeMode: 'contain',
                  margin: 30,
                }}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserEmail) => setUserEmail(UserEmail)}
                placeholder="Enter Email" //dummy@abc.com
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserPassword) => setUserPassword(UserPassword)}
                placeholder="Enter Password" //12345
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleLogin2}>
              <Text style={styles.buttonTextStyle}>LOGIN</Text>
            </TouchableOpacity>
            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('RegisterScreen')}>
              New Here ? Register
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#307ecc',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});


// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
// import axios from 'axios';

// const LoginScreen = ({ navigation }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     console.log(123213);
//     try {
//       // Gửi yêu cầu đăng nhập đến API
//       // const response = await axios.post('http://10.0.3.2:8080/login', {
//       //   username: "tea@gmail.com",
//       //   password: "1",
//       // });
//       // console.log(13213);
//       // // Kiểm tra phản hồi từ API
//       // if (response.data.success) {
//       //   // Đăng nhập thành công, thực hiện các hành động khác nếu cần
//       //   Alert.alert('Login Successful', 'Welcome back!');
//       //   // Chuyển hướng đến màn hình khác nếu cần
//       //   navigation.navigate('HomeScreen');
//       // } else {
//       //   // Đăng nhập thất bại, hiển thị thông báo lỗi
//       //   Alert.alert('Login Failed', response.data.message);
//       // }
//       const axios = require('axios');
//       var myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");
      
//       var raw = JSON.stringify({
//         "username": "tea@gmail.com",
//         "password": "1"
//       });
      
//       var requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: raw,
//         redirect: 'follow'
//       };
      
//       fetch("http://192.168.0.105:8888/login", requestOptions)
//         .then(response => response.text())
//         .then(result => console.log(result))
//         .catch(error => console.log('error', error));

//     } catch (error) {
//       console.error('Error during login:', error.message);
//     }
//   };

//   return (
//     <View>
//       <Text

// Lohhhhh


//       />

// <Text

// Lohhhhh


//       />
//       <TextInput
//         placeholder="Username"
//         value={username}
//         onChangeText={(text) => setUsername(text)}
//       />
//       <TextInput
//         placeholder="Password"
//         secureTextEntry={true}
//         value={password}
//         onChangeText={(text) => setPassword(text)}
//       />
//       <TouchableOpacity onPress={handleLogin}>
//         <Text>Login</Text>
//       </TouchableOpacity>

//       <Text
//         style={{ marginTop: 20, color: 'blue' }}
//         onPress={() => navigation.navigate('RegisterScreen')}>
//         New Here? Register
//       </Text>
//     </View>
//   );
// };

// export default LoginScreen;
