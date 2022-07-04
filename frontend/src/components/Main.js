import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, Typography, Paper, Button } from '@mui/material'
import Carousel from 'react-material-ui-carousel'
import './Main.css'
function Item(props) {
    return (
        <Paper>
            <Box sx={{
                backgroundImage: props.item.image,
                minHeight: '90vh',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
            }}/>

            <div className="bg-text">
                <h1>{props.item.name}</h1>
                <p>{props.item.description}</p>
            </div>

         
        </Paper>
    )
}
function Main() {
    var items = [
        {
            name: 'Welcome to YACS',
            description: 'Yet Another Collaborative System',
            image: 'url(https://cdn.pixabay.com/photo/2020/11/04/10/45/school-5711987_960_720.jpg)',
        },
        {
            name: 'Welcome to YACS',
            description:
                'Click the Create Workplace Button On The Upper Left to get Started',
            image: 'url(https://cdn.pixabay.com/photo/2020/04/18/16/21/online-5059828_960_720.jpg)',
        },
    ]
    return (
        <Box sx={{ minHeight: '90vh' }}>
            <CssBaseline />
            <Carousel sx={{ minHeight: '90vh' }}>
                {items.map((item, i) => (
                    <Item key={i} item={item} />
                ))}
            </Carousel>
        </Box>
    )
}

export default Main
