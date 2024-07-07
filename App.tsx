/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Pressable,
  Image,
} from 'react-native';
import { NativeModules } from 'react-native';
import { smsToTransactionListUsingOpenAI } from './lib/aiParser';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import SecureDBGateway from './lib/SecureDbGateWay';
import TransactionList from './components/TransactionList';
import { T_TransactionObj } from './common/types';
import CONFIG from './common/config';
import { ASSETS, GOOGLE } from './common/const';

GoogleSignin.configure({
  webClientId: CONFIG.GOOGLE.WEB_CLIENT_ID,
  androidClientId: CONFIG.GOOGLE.ANDROID_CLIENT_ID,
  scopes: CONFIG.GOOGLE.SCOPE,
});

const authorizeAndLoadEmails = async (accessToken: string) => {
  const email = await getEmailThreads(accessToken);
  return email;
};

async function getEmailThreads(accessToken: any) {
  const res = await fetch(
    GOOGLE.URL.GMAIL_THREADS,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )
    .then(response => response.json())
    .catch(error => {
      console.error(error);
    });
  return res.threads;
}

const { SmsReader } = NativeModules;

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
  const smsData: any = smsList.slice(0, 10);
  const parsedData = smsToTransactionListUsingOpenAI(smsData).then(
    (parsed: any) => {
      if (parsed) {
        setParsedSmsList(parsed);
      }
    },
  );
}

const App = () => {
  const [smsList, setSmsList] = useState([]);
  const [parsedSmsList, setParsedSmsList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [emailList, setEmailList] = useState([]);
  const [smsTempData, setTempData] = React.useState<T_TransactionObj[]>([]);

  const GoogleLogin = async () => {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();
    SecureDBGateway.save({
      id: userInfo.user.id,
      email: userInfo.user.email,
      token: tokens.accessToken,
    });
    setAccessToken(tokens.accessToken);
    const email = await getEmailThreads(tokens.accessToken);
    return userInfo;
  };

  const GoogleLogout = async () => {
    await GoogleSignin.signOut();
    SecureDBGateway.delete();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const response = await GoogleLogin();
    } catch (apiError: any) {
      setError(
        apiError?.response?.data?.error?.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // fetchSms(setSmsList, setParsedSmsList);
    let smsData: T_TransactionObj = {
      isTransaction: true,
      transactionType: 'credit',
      from: 'from test',
      to: 'to test',
      amount: '100',
      currency: '$',
      availableBalance: '100',
      referenceNumber: '123456789',
      date: new Date(),
      body: 'body test',
      address: 'address test',
    };

    setTempData([smsData]);

    const getAccessToken = async () => {
      const userInfo = await SecureDBGateway.load();
      if (userInfo) {
        setAccessToken(userInfo.token);
        authorizeAndLoadEmails(userInfo.token);
      }
    };

    getAccessToken();
  }, []);

  return (
    <View style={styles.container}>
      {accessToken ? (
        <View style={styles.container}>
          <Pressable onPress={GoogleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
          <TransactionList parsedTransactionList={smsTempData} />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Welcome To</Text>
          <Image
            style={styles.logo}
            source={require(ASSETS.LOGO)}
          />

          <GoogleSigninButton
            style={styles.googleButton}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={handleGoogleLogin}
            disabled={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  googleButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    justifyContent: 'center',
    color: '#3e4169',
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    borderRadius: 125,
    marginBottom: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  logoutBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'red',
    alignSelf: 'center',
  },
  logoutText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default App;
