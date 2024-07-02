import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, PermissionsAndroid } from 'react-native';
import { NativeModules } from 'react-native';



const { SmsReader } = NativeModules;

async function requestSmsPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        title: "SMS Read Permission",
        message: "This app needs access to your SMS messages to read them.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

async function fetchSms(setSmsList: any) {
  const hasPermission = await requestSmsPermission();
  if (hasPermission) {
    SmsReader.readSMS()
      .then((smsList: any) => {
        setSmsList(smsList);
        console.log('SMS list:', smsList);
      })
      .catch((error: any) => {
        console.error('Error reading SMS:', error);
      });
  }
}

const App = () => {
  const [smsList, setSmsList] = useState([]);

  useEffect(() => {
    fetchSms(setSmsList);
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.smsContainer}>
      <Text style={styles.smsAddress}>From: {item.address}</Text>
      <Text style={styles.smsBody}>{item.body}</Text>
      <Text style={styles.smsDate}>Date: {new Date(parseInt(item.date)).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={smsList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  smsContainer: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    elevation: 2,
    color: '#666',
  },
  smsAddress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  smsBody: {
    marginVertical: 8,
    fontSize: 14,
    color: '#666',
  },
  smsDate: {
    fontSize: 12,
    color: '#666',
  },
});

export default App;
