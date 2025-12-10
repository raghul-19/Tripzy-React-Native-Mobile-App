  import React, { useEffect, useRef, useState } from 'react'
  import { Image } from 'react-native'
  import MapView, { Marker } from 'react-native-maps'
  import MapViewDirections from 'react-native-maps-directions'
  import { drivers, modernLightTheme } from '../dataSet'
import { generateRandomPoint } from '../utils/helpers'

  const MapComponent = ({ userCoordinates, destination = null, selectedRider=null}) => {
    const userLocation = userCoordinates
    const [trackViewChanges, setTrackViewChanges] = useState(true)
    const [driverList,setDriverList]=useState([]);
    const mapRef = useRef(null)

    useEffect(() => {
      setTrackViewChanges(true)
      if (userLocation.latitude === null && userLocation.longitude === null) return
      const timeout = setTimeout(() => setTrackViewChanges(false), 1000)
      return () => clearTimeout(timeout)
    }, [userLocation,selectedRider])

    useEffect(() => {
      if(userLocation.latitude===null && userLocation.longitude===null ) return;
      setDriverList(drivers.map((driver) => {
        return ({...driver,coordinates:generateRandomPoint(userLocation,driver.distance)})
      }))
    },[userLocation])
    
    return (
      <MapView
        ref={mapRef}
        customMapStyle={modernLightTheme}
        showsUserLocation={!!userLocation.latitude}
        style={{ width: '100%', height: '100%'}}
        region={{
          latitude: userLocation.latitude || 37.78825,
          longitude: userLocation.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {userLocation.latitude && userLocation.longitude && (
          <>
            <Marker coordinate={userLocation} />

            {driverList && driverList.map((driver, index) => {
              const normalMarker = require("../../assets/icons/marker.png");
              const selectedMarker = require("../../assets/icons/selected-marker.png");

              return (
                

                <Marker
                  tracksViewChanges={trackViewChanges}
                  key={index}
                  title={driver.name}
                  coordinate={driver.coordinates}
                >
                  <Image
                    source={selectedRider?.name===driver.name?selectedMarker:normalMarker}
                    style={{ width: 40, height: 40, resizeMode: 'contain' }}
                  />
                </Marker>
                
              )
            })}

            {userCoordinates.latitude && destination && (
              <>
                <Marker pinColor="green" coordinate={destination} />
                <MapViewDirections
                  origin={userCoordinates}
                  destination={destination}
                  apikey={process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY}
                  strokeWidth={4}
                  strokeColor="#0286FF"
                  onReady={(result) => {
                    mapRef.current?.fitToCoordinates(result.coordinates, {
                      edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
                      animated: true,
                    })
                  }}
                />
              </>
            )}
          </>
        )}
      </MapView>
    )
  }

  export default MapComponent
