import axios from 'axios'
const baseUrl = '/api/v1/room'
export async function createRoomService(){
    // const config = {
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //     },
    // }
    const response = await axios.get(baseUrl)
    return response.data
}