import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getRoomFromId } from '../features/room/Reducers'
import CssBaseline from '@mui/material/CssBaseline'
import io from 'socket.io-client'
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    CardMedia,
} from '@mui/material'

function Video(props) {
    const ref = useRef()
    useEffect(() => {})
}

function DeviceSelect(props) {
    const [choice, SetChoice] = useState(0)
    //props.type props.onChange props.devices
    const handleDeviceChange = (event) => {
        SetChoice(event.target.value)
        props.handleSelect(props.devices[event.target.value], props.type)
    }

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>{props.type}</InputLabel>
            <Select
                defaultValue={0}
                value={choice}
                onChange={handleDeviceChange}
            >
                {props.devices.map((e, index) => (
                    <MenuItem key={index} value={index}>
                        {e.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

function Room() {
    let { id } = useParams()
    const dispatch = useDispatch()
    const { isError, room } = useSelector((s) => s.room)
    const [devices, setDevices] = useState(null)
    const [open, setOpen] = useState(null)
    const [stream, setStream] = useState(null)
    const [selected, setSelected] = useState(null)
    const localVideoRef = useRef(null)
    const socketRef = useRef(null)
    const peers = useRef(new Map())
    function createPeer(targetId,sourceId){
        const pc = new RTCPeerConnection()
        pc.onicecandidate = e =>{
            const data = {
                from:sourceId,
                to:targetId,
                candidate:null
            }
            if(e.candidate){
                data.candidate = e.candidate.candidate
                data.sdpMid = e.candidate.sdpMid
                data.sdpMLineIndex = e.candidate.sdpMLineIndex
            }
            socketRef.current.emit('candidate',data)
        }
        pc.ontrack = e => console.log(e.streams);
        stream?.getTracks().forEach(track=>pc.addTrack(track,stream))
        return pc
    }
    useEffect(() => {
        dispatch(getRoomFromId(id))
        handleGetMedia()
        socketRef.current = io.connect('/')
        socketRef.current.on('users', (data) => {
            console.log('data:', data)
            data.forEach(async(targetId) => {
                const sourceId = socketRef.current.id
                const pc = createPeer(targetId,sourceId)   
                const offer = await pc.createOffer()
                socketRef.current.emit('offer',{from:sourceId,to:targetId,sdp:offer.sdp})   
                await pc.setLocalDescription(offer)
                peers.current.set(targetId,pc)  
            });
        })
        socketRef.current.on('offer',async(data)=>{
            const sourceId = socketRef.current.id
            const targetId = data.from
            const pc = createPeer(targetId,sourceId)
            await pc.setRemoteDescription(data.sdp)
            const answer = await pc.createAnswer()
            socketRef.current.emit('answer',{from:sourceId,to:targetId,sdp:answer.sdp})
            await pc.setLocalDescription(answer)
            peers.current.set(targetId,pc)
        })
        socketRef.current.on('answer',async(data)=>{
            const pc = peers.current.get(data.from)
            await pc.setRemoteDescription(data.sdp)
            peers.current.set(data.from,pc)
        })
        socketRef.current.on('icecandidate',async(data)=>{
            const pc = peers.current.get(data.from)
            if(!data.candidate){
                await pc.addIceCandidate(null)
            }else{
                await pc.addIceCandidate(data)
            }
        })
        socketRef.current.on('connect_error', (err) => {
            console.log(`connect_error due to ${err.message}`)
        })
    }, [dispatch, id])
    const handleSelect = (value, type) => {
        const catagorizedDevice = selected
        catagorizedDevice[type] = value
        setSelected(catagorizedDevice)
        if (type === 'audiooutput') {
            attachSinkId(localVideoRef.current, value.deviceId)
        } else {
            handleGetMedia()
        }
    }
    function attachSinkId(element, sinkId) {
        if (typeof element.sinkId !== 'undefined') {
            element
                .setSinkId(sinkId)
                .then(() => {
                    console.log(
                        `Success, audio output device attached: ${sinkId}`
                    )
                })
                .catch((error) => {
                    let errorMessage = error
                    if (error.name === 'SecurityError') {
                        errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`
                    }
                    console.error(errorMessage)
                    // Jump back to first output device in the list as it's the default.

                    let tmp = selected
                    tmp.audiooutput = devices.audiooutput[0]
                    setSelected(tmp)
                })
        } else {
            console.warn('Browser does not support output device selection.')
        }
    }

    function handleError(error) {
        console.log(
            'navigator.MediaDevices.getUserMedia error: ',
            error.message,
            error.stack
        )
    }
    function gotStream(recievedStream) {
        setStream(recievedStream)
        localVideoRef.current.srcObject = recievedStream
        return navigator.mediaDevices.enumerateDevices()
    }
    const handleGetMedia = () => {
        const constraints = {
            audio: {
                deviceId:
                    selected && selected.audioinput
                        ? selected.audioinput.deviceId
                        : undefined,
            },
            video: {
                deviceId:
                    selected && selected.videoinput
                        ? selected.videoinput.deviceId
                        : undefined,
            },
        }
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(gotStream)
            .then(gotDevices)
            .catch(handleError)
    }
    function handleOpen() {
        let tmp = !open
        setOpen(tmp)
        if(tmp)
        socketRef.current.emit('join room', id)
    }
    const gotDevices = (devices) => {
        const catagorizedDevice = {
            audioinput: [],
            audiooutput: [],
            videoinput: [],
        }
        for (let i = 0; i < devices.length; i++) {
            switch (devices[i].kind) {
                case 'audioinput':
                    catagorizedDevice['audioinput'].push(devices[i])
                    break
                case 'audiooutput':
                    catagorizedDevice['audiooutput'].push(devices[i])
                    break
                case 'videoinput':
                    catagorizedDevice['videoinput'].push(devices[i])
                    break
                default:
                    // catagorizedDevice['other'].push(devices[i])
                    break
            }
        }
        setDevices(catagorizedDevice)
        if (selected === null) {
            setSelected({
                audioinput: catagorizedDevice['audioinput'][0],
                audiooutput: catagorizedDevice['audiooutput'][0],
                videoinput: catagorizedDevice['videoinput'][0],
            })
        }
    }

    return (
        <>
            <CssBaseline />
            <Box>Room {id}</Box>
            <Button variant="contained" onClick={handleOpen}>
                {open ? 'Hang Up' : 'Start'}
            </Button>
            <Box>
                <CardMedia
                    sx={{ width: '50%', height: '50%' }}
                    playsInline
                    autoPlay
                    id="vdo"
                    component={'video'}
                    ref={localVideoRef}
                ></CardMedia>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    {devices ? (
                        Object.entries(devices).map(([type, devicesArray]) => (
                            <DeviceSelect
                                key={type}
                                type={type}
                                devices={devicesArray}
                                handleSelect={handleSelect}
                            />
                        ))
                    ) : (
                        <></>
                    )}
                </Box>
            </Box>
        </>
    )
}

export default Room
