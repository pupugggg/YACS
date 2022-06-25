import React, { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getRoomFromId } from '../features/room/Reducers'
import CssBaseline from '@mui/material/CssBaseline'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import io from 'socket.io-client'
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    CardMedia,
    Grid,
    Typography,
} from '@mui/material'
import Peer from 'simple-peer'

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

const Video = (props) => {
    const ref = useRef()

    useEffect(() => {
        ref.current.srcObject = props.stream
    }, [])

    return (
        <CardMedia
            sx={{ width: '720', height: '480' }}
            playsInline
            autoPlay
            component={'video'}
            ref={ref}
        ></CardMedia>
    )
}

function Room() {
    let { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isError, room } = useSelector((s) => s.room)
    const [devices, setDevices] = useState(null)
    const [open, setOpen] = useState(false)
    const stream = useRef(null)
    const remoteStreamsRef = useRef(new Map())
    const [remoteStreams, setRemoteStreams] = useState([])
    const [selected, setSelected] = useState(null)
    const localVideoRef = useRef(null)
    const socketRef = useRef(null)
    const peersRef = useRef(new Map())
    const [start, setStart] = React.useState(false)
    function handleOnTrack(e, socketId) {
        remoteStreamsRef.current.set(socketId, e.streams[0])
        setRemoteStreams([...remoteStreamsRef.current.values()])
    }
    function closePeer(socketId) {
        if (!peersRef.current.has(socketId)) return
        peersRef.current.get(socketId).peer.close()
        peersRef.current.delete(socketId)
        remoteStreamsRef.current
            .get(socketId)
            .getTracks()
            .forEach((track) => track.stop())
        remoteStreamsRef.current.delete(socketId)
        setRemoteStreams([...remoteStreamsRef.current.values()])
    }
    function handleCloseSelf() {}
    function handleConnectionStateChange(state, socketId) {
        switch (state) {
            case 'disconnected':
            case 'closed':
            case 'failed':
                console.log(state)
                closePeer(socketId)
                break
            default:
                console.log(state)
                break
        }
    }
    async function createPeerConnection(callee) {
        const iceConfig = {
            iceServers: [{ url: 'stun:stun.l.google.com:19302' }],
        }
        const pc = new RTCPeerConnection(iceConfig)
        pc.onicecandidate = (e) => {
            socketRef.current.emit('new-ice-candidate', {
                candidate: e.candidate,
                target: callee,
                source: socketRef.current.id,
            })
        }
        pc.ontrack = (e) => {
            handleOnTrack(e, callee)
        }
        stream.current
            .getTracks()
            .forEach((track) => pc.addTrack(track, stream.current))
        const offerOptions = {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1,
        }
        const offer = await pc.createOffer(offerOptions)
        await pc.setLocalDescription(offer)
        pc.onconnectionstatechange = (ev) => {
            handleConnectionStateChange(pc.connectionState, callee)
        }
        socketRef.current.emit('video-offer', { offer: offer, callee: callee })
        peersRef.current.set(callee, {
            id: callee,
            peer: pc,
        })
    }
    async function addPeerConnection(caller, offer) {
        const iceConfig = {
            iceServers: [{ url: 'stun:stun.l.google.com:19302' }],
        }
        const pc = new RTCPeerConnection(iceConfig)
        pc.onicecandidate = (e) => {
            socketRef.current.emit('new-ice-candidate', {
                candidate: e.candidate,
                target: caller,
                source: socketRef.current.id,
            })
        }
        pc.ontrack = (e) => {
            handleOnTrack(e, caller)
        }
        pc.onconnectionstatechange = (e) => {
            handleConnectionStateChange(pc.connectionState, caller)
        }
        await pc.setRemoteDescription(offer)
        stream.current
            .getTracks()
            .forEach((track) => pc.addTrack(track, stream.current))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        socketRef.current.emit('video-answer', {
            answer: answer,
            caller: caller,
        })
        peersRef.current.set(caller, {
            id: caller,
            peer: pc,
        })
    }
    async function setPeerConnectionAnswer(callee, answer) {
        await peersRef.current.get(callee).peer.setRemoteDescription(answer)
    }
    async function setPeerConnectionCandidate(source, candidate) {
        await peersRef.current.get(source).peer.addIceCandidate(candidate)
    }
    function configSocket() {
        socketRef.current = io.connect('/')
        socketRef.current.on('callee-list', async (callees) => {
            callees.forEach(async (callee) => {
                await createPeerConnection(callee)
            })
        })
        socketRef.current.on('video-offer', async (data) => {
            // console.log('video-offer', data, 'im', socketRef.current.id)
            await addPeerConnection(data.caller, data.offer)
        })
        socketRef.current.on('video-answer', async (data) => {
            // console.log('video-answerr', data, 'im', socketRef.current.id)
            await setPeerConnectionAnswer(data.callee, data.answer)
        })
        socketRef.current.on('new-ice-candidate', async (data) => {
            // console.log('new-ice-candidate', data, 'im', socketRef.current.id)
            await setPeerConnectionCandidate(data.source, data.candidate)
        })
        socketRef.current.on('connect_error', (err) => {
            console.log(`connect_error due to ${err.message}`)
        })
        socketRef.current.on('bye', (socketId) => {
            closePeer(socketId)
        })
    }
    useEffect(() => {
        dispatch(getRoomFromId(id))
        if (isError) {
            navigate('/')
        }
        handleGetMedia()
        configSocket()

        return () => {
            socketRef.current.close()
        }
    }, [dispatch, id, isError])
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
        stream.current = recievedStream
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
    function handleStart() {
        let currentState = !start
        setStart(currentState)
        if (currentState && stream.current) socketRef.current.emit('join', id)
        if (!currentState) {
            socketRef.current.emit('leave')
            ;[...peersRef.current.keys()].forEach((socketId) => {
                peersRef.current.get(socketId).peer.close()
                peersRef.current.delete(socketId)
            })
            peersRef.current = new Map()
            remoteStreamsRef.current = new Map()
            setRemoteStreams([])
        }
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
    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }
    return (
        <>
            <CssBaseline />
            <Box>Room {id}</Box>
            <Button variant="contained" onClick={handleStart}>
                {start ? 'Hang Up' : 'Start'}
            </Button>
            {!start ? (
                <Button variant="contained" onClick={handleClickOpen}>
                    Devices
                </Button>
            ) : (
                <></>
            )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{'Select Your Devices'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        {devices ? (
                            Object.entries(devices).map(
                                ([type, devicesArray]) => (
                                    <DeviceSelect
                                        key={type}
                                        type={type}
                                        devices={devicesArray}
                                        handleSelect={handleSelect}
                                    />
                                )
                            )
                        ) : (
                            <></>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>

            <Grid container spacing={2}>
                <Grid item xs={6} md={6} lg={6}>
                    <CardMedia
                        sx={{ width: '720', height: '480' }}
                        playsInline
                        autoPlay
                        component={'video'}
                        ref={localVideoRef}
                    ></CardMedia>
                </Grid>

                {remoteStreams.map((remoteStream, index) => (
                    <Grid item key={index} xs={6} md={6} lg={6}>
                        <Video stream={remoteStream} />
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default Room
