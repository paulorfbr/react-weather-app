import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Linking,
} from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [weather, setWeather] = useState({});
  const [descriptionWeather, setDescriptionWeather] = useState({});

  const prepareLocation = async () => {
    // 1- checks for permission
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      // 2- fetch the location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } else {
      setErrorMsg('Permission to access location was denied');
    }
  };

  const fetchWeather = async () => {
    let lat = location.coords?.latitude;
    let lon = location.coords?.longitude;
    console.log(lat);
    console.log(lon);
    let apiKey = '4cbdb142954440b914a357ddd9ad939b';
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const body = await res.json();
    console.log(body);
    console.log(body.weather[0].description);
    setWeather( body);
    if (body.weather && body.weather[0]){
      setDescriptionWeather(body.weather[0].description);
    }
  }


  useEffect(() => {
    prepareLocation();
    fetchWeather();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.app}>
        <Text style={styles.paragraph}>The current weather is{' '}</Text>
        <Text style={styles.weather}>{weather.main?.temp}</Text>
        <Text style={styles.paragraph}>Thermic sensation{' '}</Text>
        <Text style={styles.weather}>{weather.main?.feels_like}</Text>
        <Text style={styles.paragraph}>Description{' '}</Text>
        <Text style={styles.description}>{descriptionWeather}</Text>
        <View style={styles.coords}>
          <Text>Latitude: {location.coords?.latitude}</Text>
          <Text>Longitude: {location.coords?.longitude}</Text>
        </View>
        <View style={styles.coords}>
          <Text>Place: {weather.name}</Text>
        </View>
      </View>
      <StatusBar></StatusBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  app: {
    flex: 1,
    justifyContent: 'center'
  },
  paragraph: {
    textAlign: 'center',
    fontSize: 24,
    marginTop: 40
  },
  weather: {
    textAlign: 'center',
    fontSize: 48,
    marginVertical: 40
  }, 
  description: {
    textAlign: 'center',
    fontSize: 24,
    marginVertical: 40
  }, 
  coords: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  }
});