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

const TourList = () => {
  const navigate = useNavigate();

  const [tours, setTours] = useState(null);


    useEffect(()=>{
        searchTours()
    },[])

    const searchTours = () => {
        apiClient.get('/tours')
        .then((result)=>{
            console.log(result)
            setTours(result)
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    const createTour = () => {
        navigate(constants.ROUTES.NEW_TOUR)
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
                                <Image variant="top" src={item?.mainImage} />
                            </Col>
                            <Col>
                                <Card.Title>{item?.name}</Card.Title>
                                <Card.Text style={{paddingLeft:12}}>
                                    <Row>{item?.description}</Row>
                                    <Row>{'Pendiente de Aprobación'}</Row>
                                </Card.Text>
                                <Button variant="primary">Ver Detalle</Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                )
            }
        </Container>
    )
}


export default TourList;