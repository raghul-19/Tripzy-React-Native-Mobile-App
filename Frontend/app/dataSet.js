
import image1 from '../assets/images/onboarding1.png';
import image2 from '../assets/images/onboarding2.png';
import image3 from '../assets/images/onboarding3.png';
import home from '../assets/icons/home.png'
import history from '../assets/icons/list.png'
import chat from '../assets/icons/chat.png'
import profile from '../assets/icons/profile.png'


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