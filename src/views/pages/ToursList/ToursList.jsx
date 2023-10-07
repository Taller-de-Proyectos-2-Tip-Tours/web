/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect,useState } from 'react';
import './ToursList.css';
import apiClient from '../../../services/apiClient'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import constants from '../../../assets/constants';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import {auth} from '../../../services/googleAuth';
import Loader from '../../utils/Loader/Loader'
const TourList = () => {
    const navigate = useNavigate();

    const [tours, setTours] = useState(null);
    const [user,setUser] = useState(null)
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        auth.authStateReady().then(()=>{
        setUser(auth.currentUser)
        })
    },[])

    useEffect(()=>{
        if(user) searchTours()
    },[user])

    const searchTours = () => {
        setLoading(true);
        apiClient.get(`/tours?guideEmail=${user.email}`)
        .then((result)=>{
            console.log(result)
            setTours(result)
            setLoading(false);
        })
        .catch(function (error) {
            console.log(error);
            setLoading(false);
        })
    }

    const createTour = () => {
        navigate(constants.ROUTES.NEW_TOUR)
    }

    const editTour = (id) =>{
        console.log('editTour',id)
        navigate(constants.ROUTES.TOUR_LIST+'/'+id)
    }

    return (
        <Container>
            <Row style={{ marginBottom:12 }}>
                <Col>
                    <Button className='primary-button' onClick={createTour}>
                        <FontAwesomeIcon icon={faPlus} className='button-icon'></FontAwesomeIcon>
                        Nuevo Paseo
                    </Button>
                </Col>
                <Col>
                    <Button className='primary-button'>
                        <FontAwesomeIcon icon={faRefresh} className='button-icon' onClick={searchTours}></FontAwesomeIcon>
                        Recargar
                    </Button>
                </Col>
            </Row>
            {
                tours&&
                tours.map((item)=>
                <Card style={{ width: '50vw',marginBottom:12 }}>
                    <Card.Body>
                        <Row>
                            <Col xs={3} md={3}>
                                <Image variant="top" src={item?.mainImage} style={{maxWidth:'11vw'}} />
                            </Col>
                            <Col>
                                <Card.Title>{item?.name}</Card.Title>
                                <Card.Text style={{paddingLeft:12}}>
                                    <Row>{item?.description}</Row>
                                    <Row>{'Pendiente de Aprobación'}</Row>
                                </Card.Text>
                                <Button variant="primary" onClick={()=>editTour(item._id.$oid)}>Ver Detalle</Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                )
            }
        {loading&&<Loader></Loader>}
        </Container>
    )
}


export default TourList;