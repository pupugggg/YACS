import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import { useDispatch,useSelector } from 'react-redux'
import { login } from '../features/auth/Reducers'
import isEmail from 'validator/lib/isEmail'
import isEmpty from 'validator/lib/isEmpty'
import { ToastContainer, toast } from 'material-react-toastify';
import { useNavigate } from 'react-router-dom'
export default function SignInSide() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {isError,isSuccess,message,user} = useSelector(s=>s.auth)
    React.useEffect(()=>{ 
        if(isError){
            toast.error(message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        }
        if (user || isSuccess) {
            navigate('/')
        }
    },[dispatch,isError,message,user,isSuccess,navigate])
    const [validEmail, setValidEmail] = React.useState({
        error:false,
        msg:''
    })
    const [validPassword, setValidPassword] = React.useState({
      error:false,
      msg:''
  })
  
    const handleEmailChange=(e)=>{
      const isError = !(!isEmpty(e.target.value)&& isEmail(e.target.value))
      const errorMsg = isEmpty(e.target.value) ? 'Email field can not be empty.':'Invalid Email'
      setValidEmail({
        error:isError,
        msg:isError?errorMsg:''
    })
    }
    const handlePasswordChange=(e)=>{
      const isError = !(!isEmpty(e.target.value))
      
      setValidPassword({
        error:isError,
        msg:isError?'Password field can not be empty':''
    })
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        if(validEmail.error || validPassword.error){
          return
        }
        const data = new FormData(event.currentTarget)
        dispatch(login({
            email: data.get('email'),
            password: data.get('password'),
        })).then(res=>navigate('/dashboard'))
    }

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <ToastContainer/>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'url(https://source.unsplash.com/random)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light'
                            ? t.palette.grey[50]
                            : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
            >
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            helperText={validEmail.msg}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onBlur={e=>handleEmailChange(e)}
                            onChange={e=>handleEmailChange(e)}
                            error={validEmail.error}
                        />
                        <TextField
                            helperText={validPassword.msg}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onBlur={e=>handlePasswordChange(e)}
                            onChange={e=>handlePasswordChange(e)}
                            error={validPassword.error}
                        />
                        <Button
                            type="submit"
                            disabled={validEmail.error || validPassword.error}
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/register" variant="body2" sx={{color:'white'}}>
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}
