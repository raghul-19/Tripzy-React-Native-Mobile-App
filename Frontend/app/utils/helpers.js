import axios from 'axios';

const apiKey=process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY;

export const nameToCoordinates=async (placeName) => {
    const url =`https://maps.googleapis.com/maps/api/geocode/json?address=`+encodeURIComponent(placeName) +`&key=${apiKey}`;
    const response=await fetch(url);
    const data=await response.json();
    if(data.status!=="OK" || !data.results?.length) {
        throw new Error("Location not found");
    }
    const {lat,lng}=data.results[0].geometry.location;
    return {latitude:lat,longitude:lng}
}

export const coordinatesToName=async ({latitude,longitude}) => {
    const url =`https://maps.googleapis.com/maps/api/geocode/json?latlng=` +`${latitude},${longitude}&key=${apiKey}`;
    const response=await fetch(url);
    const data=await response.json();
    if(data.status!=="OK" || !data.results?.length) {
        throw new Error("Name not found");
    }
    return data.results[0].formatted_address;
}





const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY; // Replace with your key

export const getTravelTimeMinutes = async (sourceCoords, destCoords) => {
  try {
    const origins = `${sourceCoords.latitude},${sourceCoords.longitude}`;
    const destinations = `${destCoords.latitude},${destCoords.longitude}`;
    
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?` +
      `origins=${origins}&` +
      `destinations=${destinations}&` +
      `key=${GOOGLE_MAPS_API_KEY}&` +
      `mode=driving&` +
      `units=metric&` +
      `language=en`;
    
    const response = await axios.get(url);
    const element = response.data.rows[0].elements[0];
    
    if (element.status === 'OK') {
      return Math.round(element.duration.value / 60); // Convert seconds to minutes
    } else {
      throw new Error(`API Error: ${element.status}`);
    }
  } catch (error) {
    console.error('Travel time calculation failed:', error);
    throw error;
  }
};

export const calculateFare = (distanceKm) => {
  const baseFare = 30;       
  const costPerKm = 10;      

  const fare = baseFare + distanceKm * costPerKm;
  return Math.round(fare);   
};

export const calculateDriverFares = (fare, numberOfDrivers = 6) => {  // ← 'fare', not 'baseFare'
  const fares = [];

  for (let i = 0; i < numberOfDrivers; i++) {
    const variationPercent = (Math.random() * 7 + 5) / 100;  
    const addOrMinus = Math.random() < 0.5 ? -1 : 1;
    const finalFare = Math.round(fare + fare * variationPercent * addOrMinus);  // ← 'fare'
    fares.push(finalFare);
  }

  return fares;  
};

export const getRealDrivingDistance = async (source, destination) => {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${source.latitude},${source.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY}`;  
  const res = await fetch(url);
  const data = await res.json();
  const distanceMeters = data.rows[0].elements[0].distance.value;
  return distanceMeters / 1000; // km
};

export const generateRandomPoint = (userLocation,radiusKm = 6) => {
  const r = radiusKm / 111
  const u = Math.random()
  const v = Math.random()
  const w = r * Math.sqrt(u)
  const t = 2 * Math.PI * v
  const lat = userLocation.latitude + w * Math.cos(t)
  const lng = userLocation.longitude + w * Math.sin(t)
  return { latitude: lat, longitude: lng }
}

export const convertMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;      
  if (mins === 0) return `${hours}h`;     

  return `${hours}h ${mins}m`;             
};

export const generateRideDetails=(location,selectedRider,email) => {
  return ({
    sourceName: location.source.name,
    destinationName: location.destination.name,
    sourceLatitude: location.source.coords.latitude,
    sourceLongitude: location.source.coords.longitude,
    destinationLatitude: location.destination.coords.latitude,
    destinationLongitude: location.destination.coords.longitude,
    distance: selectedRider.distance,
    fare: selectedRider.fare,
    time: selectedRider.time,
    duration: selectedRider.duration,
    ratings: selectedRider.ratings,
    name: selectedRider.name,
    seats: 4,
    email: email,
  })
}

export function formatCreatedAt(createdAt) {
  const date = new Date(createdAt);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",  
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}






