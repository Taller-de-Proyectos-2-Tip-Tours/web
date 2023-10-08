import React, {useState,useEffect} from 'react';
import { Paper } from '@mui/material';
import './Home.css';
import Image from '../../../assets/images/imagen_principal.jpg';
import {signInWithGoogle,auth} from '../../../services/googleAuth';
import { useNavigate } from "react-router-dom";
import constants from '../../../assets/constants';
import IconButton from '@mui/material/IconButton';
import { Google } from '@mui/icons-material';
const styles = {
    paperContainer: {
        backgroundImage: `url(${Image})`,
        // backgroundRepeat: 'no-repeat'
        backgroundSize: 'cover'
    }
};

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
        <Paper style={styles.paperContainer}>
            <div className='section-intro'>
                <div className='section-intro-title'>
                    El futuro del Turismo
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
                <Google /> Login
              </IconButton>}
            </div>
        </ Paper>
    )
}


export default Home;
