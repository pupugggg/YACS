import axios from 'axios'
const BASE_URL = '/api/v1/room'
export async function createRoomService(){
    // const config = {
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //     },
    // }
    const response = await axios.get(BASE_URL)
    return response.data
}