import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const TransactionList = ({
  parsedTransactionList,
}: {
  parsedTransactionList: any;
}) => {
  const renderItem = ({ item }: { item: any }) => (
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
        data={parsedTransactionList}
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

export default TransactionList;
