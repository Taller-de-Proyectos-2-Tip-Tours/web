import React, {useState,useEffect} from 'react';
import './Home.css';
import Image1 from '../../../assets/images/paisaje.jpg';
import Image2 from '../../../assets/images/paisaje_2.jpg';
import Image3 from '../../../assets/images/paisaje_3.jpg';
import Image4 from '../../../assets/images/paisaje_4.jpg';
import {signInWithGoogle,auth} from '../../../services/googleAuth';
import { useNavigate } from "react-router-dom";
import constants from '../../../assets/constants';
import IconButton from '@mui/material/IconButton';
import { Google } from '@mui/icons-material';
import Carousel from 'react-bootstrap/Carousel';
import { Image } from 'react-bootstrap';

const Home = () => {
    const navigate = useNavigate();

    const onLogin = () =>{
        signInWithGoogle().then(()=>{
          navigate(constants.ROUTES.HOME)
          window.location.reload(false);
        })
    }

    const [user,setUser] = useState(null)

    useEffect(()=>{
        auth.authStateReady().then(()=>{
        setUser(auth.currentUser)
        })
    },[])

    return (
        <>
            <Carousel>
                <Carousel.Item>
                    <Image style={{height:'80vh',minWidth:'90vw'}} src={Image1}></Image>
                </Carousel.Item>
                <Carousel.Item>
                    <Image style={{height:'80vh',minWidth:'90vw'}} src={Image2}></Image>
                </Carousel.Item>
                <Carousel.Item>
                    <Image style={{height:'80vh',minWidth:'90vw'}} src={Image3}></Image>
                </Carousel.Item>
                <Carousel.Item>
                    <Image style={{height:'80vh',minWidth:'90vw'}} src={Image4}></Image>
                </Carousel.Item>
            </Carousel>
            <div className='section-intro' style={{left:user===null?45:185}}>
                <div className='section-intro-title'>
                    El futuro del turismo
                </div>
                {user===null&&<IconButton
                onClick={onLogin}
                style={{
                    fontSize:22,
                    color:'white',
                    backgroundColor:'#4E598C',
                    borderRadius:8,
                    marginTop:8,
                }}
                >
                <Google /> Iniciar sesión
              </IconButton>}
            </div>
        </>
    )
}


export default Home;
