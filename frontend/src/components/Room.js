import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getRoomFromId } from '../features/room/Reducers'
import CssBaseline from '@mui/material/CssBaseline'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
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
        props.peer.on('stream', (stream) => {
            ref.current.srcObject = stream
        })
    }, [])

    return (
        <CardMedia
            sx={{ width: '50%', height: '50%' }}
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
    const { isError, room } = useSelector((s) => s.room)
    const [devices, setDevices] = useState(null)
    const [open, setOpen] = useState(false)
    const stream = useRef(null)
    const [selected, setSelected] = useState(null)
    const localVideoRef = useRef(null)
    const socketRef = useRef(null)
    const peersRef = useRef([])
    const [peers, setPeers] = useState([])
    const [start, setStart] = React.useState(false)
    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        })

        peer.on('signal', (signal) => {
            socketRef.current.emit('sending signal', {
                userToSignal,
                callerID,
                signal,
            })
        })

        return peer
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on('signal', (signal) => {
            socketRef.current.emit('returning signal', { signal, callerID })
        })

        peer.signal(incomingSignal)

        return peer
    }

    useEffect(() => {
        dispatch(getRoomFromId(id))
        handleGetMedia()

        socketRef.current = io.connect('/')
        socketRef.current.on('connect_error', (err) => {
            console.log(`connect_error due to ${err.message}`)
        })
        socketRef.current.on('all users', (users) => {
            const peers = []
            users.forEach((userID) => {
                const peer = createPeer(
                    userID,
                    socketRef.current.id,
                    stream.current
                )
                peersRef.current.push({
                    peerID: userID,
                    peer,
                })
                peers.push(peer)
            })
            setPeers(peers)
        })

        socketRef.current.on('user joined', (payload) => {
            const peer = addPeer(
                payload.signal,
                payload.callerID,
                stream.current
            )
            peersRef.current.push({
                peerID: payload.callerID,
                peer,
            })

            setPeers((users) => [...users, peer])
        })

        socketRef.current.on('receiving returned signal', (payload) => {
            const item = peersRef.current.find((p) => p.peerID === payload.id)
            item.peer.signal(payload.signal)
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
        let tmp = !start
        setStart(tmp)
        if (tmp && stream.current) socketRef.current.emit('join room', id)
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
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    return (
        <>
            <CssBaseline />
            <Box>Room {id}</Box>
            <Button variant="contained" onClick={handleStart}>
                {start ? 'Hang Up' : 'Start'}
            </Button>
            <Button variant="outlined" onClick={handleClickOpen}>
                Devices
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle >
                    {"Select Your Devices"}
                </DialogTitle>
                <DialogContent>
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
                </DialogContent>
            </Dialog>
            <Box>
                <CardMedia
                    sx={{ width: '50%', height: '50%' }}
                    playsInline
                    autoPlay
                    component={'video'}
                    ref={localVideoRef}
                ></CardMedia>
                
                {peers.map((peer, index) => {
                    return <Video key={index} peer={peer} />
                })}
            </Box>
        </>
    )
}

export default Room
