
import image1 from '../assets/images/onboarding1.png';
import image2 from '../assets/images/onboarding2.png';
import image3 from '../assets/images/onboarding3.png';
import home from '../assets/icons/home.png'
import history from '../assets/icons/list.png'
import chat from '../assets/icons/chat.png'
import profile from '../assets/icons/profile.png'
import driver1 from '../assets/images/driver1.png'
import driver2 from '../assets/images/driver2.png'
import driver3 from '../assets/images/driver3.png'
import driver4 from '../assets/images/driver4.png'
import driver5 from '../assets/images/driver5.png'
import driver6 from '../assets/images/driver6.jpg'


export const welcomPageDataSet=[
    {
        image:image1,
        title:"The best car in your\nhands with Ryde",
        description:"Discover the convenience of finding\nyour perfect ride with our Ryde App"

    },
    {
        image:image2,
        title:"The perfect ride is\njust a tap away!",
        description:"Your journey begins with Ryde.\nFind your ideal ride effortlessly."
    },
    {
        image:image3,
        title:"Your ride, your way.\nLet's get started!",
        description:"Enter your destination, sit back, and\nlet us take care of the rest."
    }

];

export const menubar=[
    {
        image:home,
        route:"/page/home"
    },
    {
        image:history,
        route:"/page/history"
    },
    {
        image:chat,
        route:"/page/chat"
    },
    {
        image:profile,
        route:"/page/profile"
    }
]

export const modernLightTheme = [
    {
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }]
    },
    {
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }]
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }]
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#f5f5f5" }]
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [{ color: "#bdbdbd" }]
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#eeeeee" }]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }]
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#e5f5e0" }]   // green parks like screenshot
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }]
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#fdfcf8" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#dadada" }]
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }]
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }]
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#c9e7ff" }]   // light blue water
    }
  ];


export const drivers=[

    {
        id:1,
        name:"Kim Dokja",
        ratings:4.4,
        image:driver1,
        distance:2,
        time:5
    },

    {
        id:2,
        name:"Yoo Joonghyuk",
        ratings:4.8,
        image:driver2,
        distance:3,
        time:7
    },
    {
        id:3,
        name:"Arthur Leywin",
        ratings:4.9,
        image:driver3,
        distance:3,
        time:7
    },
    {
        id:4,
        name:"Regis",
        ratings:4.2,
        image:driver4,
        distance:4,
        time:12
    },
    {
        id:5,
        name:"Luffy",
        ratings:4.3,
        image:driver5,
        distance:5,
        time:18
    },
    {
        id:6,
        name:"Shanks",
        ratings:4.7,
        image:driver6,
        distance:4,
        time:12
    },
   

]