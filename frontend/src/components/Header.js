import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import AddBoxIcon from '@mui/icons-material/AddBox'
import WorkIcon from '@mui/icons-material/Work'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { Button } from '@mui/material'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import PersonIcon from '@mui/icons-material/Person'
import Tooltip from '@mui/material/Tooltip'
import HomeIcon from '@mui/icons-material/Home';
import isEmpty from 'validator/lib/isEmpty'
import { useDispatch, useSelector } from 'react-redux'
import { getRoomsFromUser, getRoomFromId } from '../features/room/Reducers'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../features/auth/Reducers'
import { reset } from '../features/room/roomSlice'
import { logout } from '../features/auth/authSlice'
import { createRoom, userQuitRoom } from '../features/room/Reducers'
import { useLocation, useParams } from 'react-router-dom'
import { MenuItem, Menu } from '@mui/material'
import { ToastContainer, toast } from 'material-react-toastify'
const drawerWidth = 300
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        marginTop: '3%',
       
        flexGrow: 1,
        
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    })
)

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}))
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}))
function Header(props) {
    const { id } = useParams()
    const location = useLocation()
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, isError } = useSelector((s) => s.auth)
    const { rooms, room } = useSelector((s) => s.room)
    const [open, setOpen] = React.useState(true)
    const [openJoinMenu, setOpenJoinMenu] = React.useState(false)
    const [openCreateMenu, setOpenCreateMenu] = React.useState(false)

    const url = React.useRef('')
    const name = React.useRef('')
    const handleOpenJoin = () => {
        setOpenJoinMenu(true)
    }
    const handleCloseJoin = () => {
        setOpenJoinMenu(false)
    }
    const handleOpenCreate = () => {
        setOpenCreateMenu(true)
    }
    const handleCloseCreate = () => {
        setOpenCreateMenu(false)
    }
    const handleUrlChange = (e) => {
        url.current = e.target.value
    }
    const handleNameChange = (e) => {
        name.current = e.target.value
    }
    const handleJoin = () => {
        if (
            url.current.startsWith('http://') ||
            url.current.startsWith('https://')
        ) {
            window.location.assign(url.current)
        } else {
            window.location.href = '/room/' + url.current
        }
        handleCloseJoin()
    }
    const handleCreate = () => {
        const workname = name.current
        if (isEmpty(workname)) {
            handleCloseCreate()
            return
        }

        dispatch(createRoom(workname))
        handleCloseCreate()
    }
    useEffect(() => {
        dispatch(getRoomsFromUser())
        if (
            !user &&
            !(
                location.pathname.endsWith('login') ||
                location.pathname.endsWith('register')
            )
        ) {
            navigate('/login')
        }
        if (user && !user.id) {
            dispatch(getMe())
        }
        if (location.pathname.startsWith('/room')) {
            const regex = /[^'room/']/g
            const str = location.pathname
            dispatch(getRoomFromId(str.substring(str.search(regex) - 1)))
        }
        if (isError) {
            console.log('error')
        }
        return () => {
            dispatch(reset())
        }
    }, [id, dispatch, user, navigate, isError, location])
    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }
    const [anchorElUser, setAnchorElUser] = React.useState(null)

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }
    const [contextMenu, setContextMenu] = React.useState(null)
    const handleContextMenu = (event, roomId) => {
        event.preventDefault()
        setContextMenu(
            contextMenu === null
                ? {
                      mouseX: event.clientX + 2,
                      mouseY: event.clientY - 6,
                      roomId: roomId,
                  }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                  null
        )
    }
    const handleContextMenuClose = () => {
        setContextMenu(null)
    }
    const handleDeleteChannel = () => {
        const roomId = contextMenu.roomId
        if (roomId === room?.roomId) {
            toast.error(
                'You must leave the Channel first to Quit the workspace',
                {
                    position: 'top-center',
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
            )
            handleContextMenuClose()
            return
        }
        dispatch(userQuitRoom(roomId))
        handleContextMenuClose()
    }
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <ToastContainer />
            {user ? (
                <>
                    <Dialog open={openJoinMenu} onClose={handleCloseJoin}>
                        <DialogTitle>Join Workspace</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To join the a workspace, you must provide invite
                                url in the form or join it directly
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Invite URL"
                                type="email"
                                fullWidth
                                variant="standard"
                                onChange={handleUrlChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseJoin}>Cancel</Button>
                            <Button onClick={handleJoin}>Join</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openCreateMenu} onClose={handleCloseCreate}>
                        <DialogTitle>Create Workspace</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To create the a workspace, you must provide a
                                name for the workplace
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Workplace Name"
                                type="email"
                                fullWidth
                                variant="standard"
                                onChange={handleNameChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseCreate}>Cancel</Button>
                            <Button onClick={handleCreate}>Create</Button>
                        </DialogActions>
                    </Dialog>
                    <AppBar position="fixed" open={open}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={{ mr: 2, ...(open && { display: 'none' }) }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{ flexGrow: 1 }}
                            >
                                YACS
                            </Typography>
                           
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem
                                    onClick={(e) => {
                                        dispatch(logout())
                                        handleCloseUserMenu()
                                    }}
                                >
                                    <Typography textAlign="center">
                                        Logout
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                boxSizing: 'border-box',
                            },
                        }}
                        variant="persistent"
                        anchor="left"
                        open={open}
                    >
                        <DrawerHeader>
                        <IconButton onClick={handleOpenUserMenu} sx={{mr:'auto'}}>
                        <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                <ListItemText primary={'User'} />
                            </IconButton>
                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === 'ltr' ? (
                                    <ChevronLeftIcon />
                                ) : (
                                    <ChevronRightIcon />
                                )}
                            </IconButton>
                    
                        </DrawerHeader>
                        <Divider />
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton onClick={(e) => navigate('/')}>
                                    <ListItemIcon>
                                        <HomeIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={'Home'} />
                                </ListItemButton>
                            </ListItem>
                            {['Create WorkSpace', 'Join'].map((text, index) => (
                                <ListItem key={text} disablePadding>
                                    <ListItemButton
                                        onClick={(e) =>
                                            index % 2 === 0
                                                ? handleOpenCreate(e)
                                                : handleOpenJoin(e)
                                        }
                                    >
                                        <ListItemIcon>
                                            {index % 2 === 0 ? (
                                                <AddBoxIcon />
                                            ) : (
                                                <InboxIcon />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                        <Divider />
                        <List>
                            {rooms && rooms[0] ? (
                                rooms.map((room, index) => (
                                    <ListItem
                                        key={index}
                                        onContextMenu={(e) =>
                                            handleContextMenu(e, room.roomId)
                                        }
                                        disablePadding
                                        sx={{
                                            cursor: `context-menu`,
                                        }}
                                    >
                                        <Tooltip title="Right Click To Quit the Workspace Permanently">
                                            <ListItemButton
                                                onClick={(e) =>
                                                    navigate(
                                                        `/room/${room.roomId}`
                                                    )
                                                }
                                            >
                                                <ListItemIcon>
                                                    <LightbulbIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={room.name}
                                                />
                                            </ListItemButton>
                                        </Tooltip>
                                    </ListItem>
                                ))
                            ) : (
                                <></>
                            )}
                        </List>
                        <Menu
                            open={contextMenu !== null}
                            onClose={handleContextMenuClose}
                            anchorReference="anchorPosition"
                            anchorPosition={
                                contextMenu !== null
                                    ? {
                                          top: contextMenu.mouseY,
                                          left: contextMenu.mouseX,
                                      }
                                    : undefined
                            }
                        >
                            <MenuItem sx={{backgroundColor:'red'}} onClick={handleDeleteChannel}>
                                Quit Workspace Permanently
                            </MenuItem>
                        </Menu>
                    </Drawer>
                </>
            ) : (
                <></>
            )}
            <Main open={open}>{props.main}</Main>
        </Box>
    )
}

export default Header
