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
    }),

    updateUserProfile:async (updatedData,token) => axios.put(`http://${NETWORK_IP_ADDRESS}:8080/user/updateProfile`,updatedData,{
        headers:{
            "Authorization":`Bearer ${token}`
        }
    }),

    updateUserEmail:async (emailUpdateRequest,token) => axios.put(`http://${NETWORK_IP_ADDRESS}:8080/user/emailUpdate`,emailUpdateRequest,{
        headers:{
            "Authorization":`Bearer ${token}`
        }
    })
}