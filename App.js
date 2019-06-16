import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import WAValidator from 'wallet-address-validator';
import { Transaction } from './components/Transaction';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  unspentText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.5)',
    textAlign: 'center',
    marginBottom: 10,
  },
  bitcoinIcon: {
    height: 30,
    width: 30,
    paddingLeft: 3,
    paddingTop: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.5)',
    marginLeft: 5,
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 30,
    backgroundColor: 'rgb(194, 194, 214)',
    borderRadius: 10,
    padding: 10,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    width: 100,
    elevation: 1,
  },
  status: {
    fontSize: 12,
    color: 'rgb(230, 0, 0)',
    alignSelf: 'flex-end',
    top: 5,
    marginRight: 30,
  },
  textInput: {
    marginTop: 20,
    width: width - 50,
    height: 60,
    borderColor: 'gray',
    backgroundColor: 'rgba(255,255,255,1)',
    padding: 8,
    borderRadius: 5,
    color: 'rgba(0,0,0,0.5)',
    fontSize: 15,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 25,
    color: 'rgba(0,0,0,0.7)',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgb(194, 194, 214)',
  },
});

export default class App extends Component {
  state = {
    address: '',
    addressError: '',
    data: null,
  };

  handleSearchPressed = async () => {
    const { address } = this.state;

    if (address.length > 0) {
      const valid = WAValidator.validate(address, 'bitcoin', 'testnet');

      if (valid) {
        try {
          const response = await fetch(
            `https://chain.so/api/v2/address/BTCTEST/${address}`
          );
          const responseJson = await response.json();
          this.setState({
            data: responseJson.data,
          });
        } catch (error) {
          console.error(error);
        }
      } else
        this.setState({
          addressError: 'invalid address',
          data: null,
        });
      // invalid address
    } else {
      this.setState({
        addressError: 'empty address!',
        data: null,
      });
    }
  };

  handleAddAddress = text => {
    if (text.length >= 0) {
      this.setState({
        address: text,
        addressError: '',
        data: null,
      });
    }
  };

  render() {
    const { address, addressError, data } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: 'rgba(0,0,0,1)' }}
        >
          <View
            style={{
              alignItems: 'center',
              backgroundColor: 'rgb(194, 194, 214)',
            }}
          >
            <Text style={styles.logoText}>LASTBIT TASK</Text>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={this.handleAddAddress}
              value={address}
              placeholder="ENTER TESTNET BITCOIN ADDRESS"
            />
            {addressError !== '' && (
              <Text style={styles.status}>{addressError}</Text>
            )}
            {data && (
              <Text
                style={[
                  styles.status,
                  {
                    color: 'rgb(0, 179, 0)',
                  },
                ]}
              >
                success
              </Text>
            )}
            <TouchableOpacity
              style={styles.searchButton}
              onPress={this.handleSearchPressed}
            >
              <MaterialCommunityIcons
                name="file-find"
                size={25}
                color="rgba(0,0,0,0.5)"
              />
              <Text style={styles.searchText}>Search</Text>
            </TouchableOpacity>
            {data && (
              <View
                style={{
                  width,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <MaterialCommunityIcons
                    style={styles.bitcoinIcon}
                    name="bitcoin"
                    size={25}
                    color="rgba(0,0,0,0.7)"
                  />
                  <Text
                    style={{
                      fontSize: 23,
                      color: 'rgba(0,0,0,0.7)',
                    }}
                  >
                    {data.balance}
                  </Text>
                </View>
                <Text style={styles.unspentText}>Unspent balance</Text>
              </View>
            )}
          </View>

          {data &&
            data.txs.map((item, index) => {
              const currentDate = moment(item.time * 1000).format(
                'MMM Do, YYYY h:mm'
              );

              return (
                <Transaction
                  key={index}
                  currentDate={currentDate}
                  item={item}
                />
              );
            })}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
