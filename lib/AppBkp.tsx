import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import {NativeModules} from 'react-native';
import {smsToTransactionListUsingOpenAI} from './aiParser';

const {SmsReader} = NativeModules;

async function requestSmsPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        title: 'SMS Read Permission',
        message: 'This app needs access to your SMS messages to read them.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

async function fetchSms(setSmsList: any, setParsedSmsList: any) {
  const hasPermission = await requestSmsPermission();
  if (hasPermission) {
    SmsReader.readSMS()
      .then((smsList: any) => {
        setSmsList(smsList);
        getPasedSmsList(setParsedSmsList, smsList);
      })
      .catch((error: any) => {
        console.error('Error reading SMS:', error);
      });
  }
}

function getPasedSmsList(setParsedSmsList: any, smsList: any) {
  console.log(smsList.length, 'sms length');
  const smsData: any = smsList.slice(0, 10);
  console.log(smsData, 'sms data');
  const parsedData = smsToTransactionListUsingOpenAI(smsData).then(
    (parsed: any) => {
      if (parsed) {
        setParsedSmsList(parsed);
      }
    },
  );
  console.log(parsedData, 'parsed data');
}

const App = () => {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [smsList, setSmsList] = useState([]);
  const [parsedSmsList, setParsedSmsList] = useState([]);

  useEffect(() => {
    fetchSms(setSmsList, setParsedSmsList);
  }, []);

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.smsContainer}>
      <Text style={styles.smsAddress}>
        Trasaction Type: {item.transactionType}
      </Text>
      <Text style={styles.smsAddress}>From: {item.from}</Text>
      <Text style={styles.smsAddress}>To: {item.to}</Text>
      <Text style={styles.smsAddress}>Amount: {item.amount}</Text>
      <Text style={styles.smsAddress}>Currency: {item.currency}</Text>
      <Text style={styles.smsAddress}>
        Available Balance:{item.availableBalance}
      </Text>
      <Text style={styles.smsAddress}>
        Reference Number: {item.referenceNumber}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={parsedSmsList}
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
