import { View, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import BackButton from '../../shared/BackButton'
import { StyledTextP, StyledTitleP } from '../../shared/StyledComponents'
import Map from '../../shared/Google-Map-API/Map'
import RideInfo from '../UI-elements/RideInfo'
import ConfirmButton from '../UI-elements/ConfirmButton'
import CancelButton from '../../shared/CancelButton'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import { useStripe } from '@stripe/stripe-react-native'
import { post as nodePost } from '../../../utils/node-API'
import { HomeStatusContext } from '../../../contexts/HomeStatusContext'
import { get, put } from '../../../utils/java-API'
import { MatchInfoContext } from '../../../contexts/MatchInfoContext'
import { useTimer } from '../../../contexts/TimerContext'

const RidePassengerFound = ({ navigation }) => {
  const { homeStatus, setHomeStatus } = useContext(HomeStatusContext)
  const { matchInfo } = useContext(MatchInfoContext)
  const { initPaymentSheet, presentPaymentSheet } = useStripe()
  const [loading, setLoading] = useState(true)
  const [rideDetailsArr, setRideDetailsArr] = useState(null)
  const [rideDetails, setRideDetails] = useState(null)
  const [mapData, setMapData] = useState(null)
  const { timer } = useTimer()

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet()

    if (error) {
      console.log(`Error code: ${error.code}`, error.message)
    } else {
      console.log('Success', 'Your order is confirmed!')
      // TODO JWT?
      get('/passenger/payment/confirmation')
      setHomeStatus('waitingConfirmation')
      navigation.navigate('Home')
    }
  }

  useEffect(() => {
    // TODO Add Match Info into rideDetails, rideDetailsArr, mapData
    setRideDetails({
      ride_id: 13,
    })
    // TODO VIDEO
    setRideDetailsArr([
      {
        key: 'Other Passenger',
        value: 'Jonathan Lam (4.91★)',
        // value: 'Kathrine Koo (4.86★)',
      },
      {
        key: 'Pickup',
        value: 'Exchange Tower, \nWang Chiu Road, Kowloon Bay',
        // value: 'Princess Margaret Hospital, Kwai Chung',
      },
      {
        key: 'Dropoff',
        value: 'Yu Nga Court, \n Yi Tung Road, \nTung Chung',
        // value: 'North Lantau Island, Tung Chung',
      },
      { key: 'Estimated Pickup', value: 'Today 4:45 p.m.' },
      // { key: 'Estimated Pickup', value: 'Today 5:05 p.m.' },
      { key: 'Estimated Dropoff', value: 'Today 5:25 p.m.' },
      // { key: 'Estimated Dropoff', value: 'Today 5:35 p.m.' },
      { key: 'Saved Amount', value: '$78.30' },
      // { key: 'Saved Amount', value: '$114.60' },
    ])
    setMapData({
      origin: { latitude: 22.321045835160486, longitude: 114.20939099960918 },
      endPoint: {
        latitude: 22.281980723505754,
        longitude: 113.93933947829203,
      },
      waypoints: [
        {
          latitude: 22.34118107523209,
          longitude: 114.13377883859162,
        },
        { latitude: 22.295934099636106, longitude: 113.94669489119876 },
      ],
    })
  }, [])

  useEffect(() => {
    if (rideDetails && rideDetails.ride_id) {
      const initializePaymentSheet = async () => {
        console.log('fetchPaymentSheetParams...')
        const json = await nodePost(
          '/passenger/payment/intent/' + rideDetails.ride_id,
        )
        if (json.error) {
          console.log('fetchPaymentSheetParams error:', json.error)
          return
        }
        console.log('fetchPaymentSheetParams:', json)
        const { paymentIntent, ephemeralKey, customer } = json
        const { error } = await initPaymentSheet({
          merchantDisplayName: 'Example, Inc.',
          customerId: customer,
          customerEphemeralKeySecret: ephemeralKey,
          paymentIntentClientSecret: paymentIntent,
          allowsDelayedPaymentMethods: true,
          defaultBillingDetails: {
            name: 'Jane Doe',
          },
          returnURL: 'your-app://stripe-redirect',
        })
        console.log('init error?', error)
        setLoading(false)
      }
      initializePaymentSheet().catch((error) => {
        console.log('initializePaymentSheet error:', error)
      })
    }
  }, [rideDetails])

  const rejectMatch = () => {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: 'Reject Match',
      textBody: 'You sure you want to reject your best match?',
      button: 'Reject',
      onPressButton: () => {
        Dialog.hide()
        // TODO JWT?
        // put('/passenger/match/rejection')
        setHomeStatus('available')
        navigation.navigate('Home')
      },
    })
  }

  return (
    // TODO VIDEO
    <View tw="flex-1 bg-indigo-50">
      {mapData ? (
        <Map height="h-60" mapData={mapData} />
      ) : (
        <SafeAreaView>
          <View tw="h-60">
            <ActivityIndicator
              size={'large'}
              color={'blue'}
              style={styles.activityIndicator}
            />
          </View>
        </SafeAreaView>
      )}
      <BackButton navigation={navigation} />
      <View tw="mx-2 my-6">
        <StyledTitleP style={styles.font} tw="mb-8 self-center">
          Found Your Best Match
        </StyledTitleP>
        <View tw="mx-2">
          {rideDetailsArr ? (
            <View>
              <RideInfo rideDetailsArr={rideDetailsArr} />
              <View tw="flex-row justify-end mt-2 mb-6">
                <StyledTextP style={styles.font}>Fare: </StyledTextP>
                <StyledTextP tw="text-indigo-600" style={styles.font}>
                  $212.70
                  {/* $116.90 */}
                </StyledTextP>
              </View>
            </View>
          ) : (
            <SafeAreaView>
              <View tw="h-60">
                <ActivityIndicator
                  size={'large'}
                  color={'blue'}
                  style={styles.activityIndicator}
                />
              </View>
            </SafeAreaView>
          )}
        </View>
        <View tw="self-center"></View>
        {rideDetails && rideDetails.ride_id ? (
          <View tw="flex-row-reverse self-center">
            <ConfirmButton
              disabled={loading}
              btnLong={false}
              onPress={openPaymentSheet}
              innerText="Proceed"
            />
            <View tw="mx-2" />
            <CancelButton
              btnLong={false}
              onPress={rejectMatch}
              innerText="Reject"
            />
          </View>
        ) : (
          <SafeAreaView>
            <View tw="h-60">
              <ActivityIndicator
                size={'large'}
                color={'blue'}
                style={styles.activityIndicator}
              />
            </View>
          </SafeAreaView>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  font: { fontFamily: 'font' },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default RidePassengerFound
