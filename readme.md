# YACS

YACS is a abbreviation of the Yet Another Collabrative System. This project Combined multipeople video conference and real time rich-text collaborative editing. YACS is a channel based collaborative system, this mean user can meet and help different people by joining in the channels.

## Table of Contents  

* [DEMO](#demo)

* [Architecture](#backend--services)

* [Frontend](#frontend--client)

## DEMO

[DEMO VIDEO](https://youtu.be/4emDoLAPKLk)

[![Watch the video](https://i.imgur.com/vKb2F1B.png)](https://youtu.be/4emDoLAPKLk)

[SITE](https://3.115.67.18/)

You can Login with demo account:

| Email        | password |
|--------------|----------|
| u1@gmail.com | u1       |

## BACKEND & SERVICES

This is the overall architecture of the system

![alt text](/images/Architecture.svg)

### Singaling Server & Soceket.IO

reference to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling#the_signaling_server)

This project implemented the following offer-answer scenario in WebRTC to acheive peer to peer SDP exchange using Socket.IO and Browser API.

![protocol1](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling/webrtc_-_signaling_diagram.svg)

During SDP exchange, each client in a peer will exchange ICE candidate to get the optimize route for establishing peer-to-peer connection.The ICE exchange scenario is also implemented by Socket.IO and Browser API

![protcol2](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling/webrtc_-_ice_candidate_exchange.svg)

### Backend Services

Provided the API for CRUD the channel(Workplace) owned by user and authentications.

### Collaboration Services

Implemented by using [y-websocket](https://github.com/yjs/y-websocket) to ensure client convergence. the theory can be found [here](https://www.researchgate.net/publication/310212186_Near_Real-Time_Peer-to-Peer_Shared_Editing_on_Extensible_Data_Types)

## FRONTEND & CLIENT

* YJS

  Use [y-quill](https://github.com/yjs/y-quill) for document synchornization and rich text editing.

* React

  This project use react to speed up the development.

* Redux

  Redux can prevent the overhead of state consistent management among hierarchical react components. Redux can also provide more maintainable way to change the state (i.e. one-way data flow) when it comes to state editing.
