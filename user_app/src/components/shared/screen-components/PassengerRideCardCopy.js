import React from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useSelector } from 'react-redux'

const PassengerRideCard = ({
  status,
  fromName,
  fromTime,
  fromDate,
  toName,
  toTime,
  toDate,
  fare,
  extraFee,
}) => {
  const role = useSelector((state) => state.auth.role)

  return (
    <ScrollView tw="rounded-lg h-44 px-2 mb-2 py-2 bg-gray-100 rounded-lg shadow-md">
      <View tw="flex-row mb-2  pl-3">
        <FontAwesome5
          name="map-marker-alt"
          size={24}
          color="#E1C16E"
          style={{ marginTop: 7 }}
        />
        <View>
          <Text
            style={styles.font}
            tw={`${
              role === 'passenger' ? `text-indigo-950` : `text-teal-950`
            } pl-2`}
          >
            From:
          </Text>
          <View tw="w-36 break-words pl-2">
            <Text
              style={styles.font}
              tw={`${
                role === 'passenger' ? `text-indigo-950` : `text-teal-950`
              } `}
            >
              {fromName}
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={styles.font}
            tw={`${
              role === 'passenger' ? `text-indigo-950` : `text-teal-950`
            } pl-8`}
          >
            {fromDate}
          </Text>
          <Text
            style={styles.font}
            tw={`${
              role === 'passenger' ? `text-indigo-950` : `text-teal-950`
            } pl-8`}
          >
            {fromTime.slice(0, -3)}
          </Text>
        </View>
      </View>
      <View tw="flex-row mb-2 mt-2 pl-3">
        <FontAwesome5
          name="map-marker-alt"
          size={24}
          color="#CD7F32"
          style={{ marginTop: 7 }}
        />
        <View>
          <Text
            style={styles.font}
            tw={`${
              role === 'passenger' ? `text-indigo-950` : `text-teal-950`
            } pl-2`}
          >
            To:
          </Text>
          <View tw="w-36 break-words pl-2">
            <Text
              style={styles.font}
              tw={`${
                role === 'passenger' ? `text-indigo-950` : `text-teal-950`
              } `}
            >
              {toName}
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={styles.font}
            tw={`${
              role === 'passenger' ? `text-indigo-950` : `text-teal-950`
            } pl-8`}
          >
            {toDate}
          </Text>
          <Text
            style={styles.font}
            tw={`${
              role === 'passenger' ? `text-indigo-950` : `text-teal-950`
            } pl-8`}
          >
            {toTime.slice(0, -3)}
          </Text>
        </View>
      </View>
      <View tw="flex-row justify-between">
        {status == 'CANCELED' ? (
          <Text tw="ml-4 mt-2 text-xl bg-red-200" style={styles.font}>
            {status}
          </Text>
        ) : status == 'ALONE' || status == 'MATCHED' ? (
          <Text tw="ml-4 mt-2 text-xl bg-green-200" style={styles.font}>
            {status}
          </Text>
        ) : status == 'MATCHING' || status == 'AVAILABLE' ? (
          <Text tw="ml-4 mt-2 text-xl bg-blue-200" style={styles.font}>
            {status}
          </Text>
        ) : (
          <Text tw="ml-4 mt-2 text-xl" style={styles.font}>
            {status}
          </Text>
        )}
        {/* <Text tw="pl-6 mt-2 text-xl" style={styles.font}>
          {status}
        </Text> */}
        <View>
          <Text tw="pr-12 " style={styles.font}>
            Fare ${fare}
          </Text>
          <Text style={styles.font}>Extra ${extraFee}</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  font: { fontFamily: 'font' },
})

export default PassengerRideCard
