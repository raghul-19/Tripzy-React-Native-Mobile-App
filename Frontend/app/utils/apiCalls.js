import axios from "axios";

const NETWORK_IP_ADDRESS="192.168.1.3";

export const apiCalls={

    createOrGetUserData:(tokenData) => axios.post(`http://${NETWORK_IP_ADDRESS}:8080/auth/create`,tokenData,{
        headers:{
            'Content-Type':"application/json"
        }
    }),

    verifyJWTTokenValidity:(token) => axios.post(`http://${NETWORK_IP_ADDRESS}:8080/auth/verify`,token,{
        headers: {
            "Content-Type":"application/json"
        }
    })
}