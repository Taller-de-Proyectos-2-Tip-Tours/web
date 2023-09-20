import React, { useEffect } from 'react';
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

const TourList = () => {
  const navigate = useNavigate();

    useEffect(()=>{
        searchTours()
    },[])

    const searchTours = () => {
        apiClient.get('/tours')
        .then((result)=>{
            console.log(result)
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
            <Row>
                <Col>
                    <Button className='primary-button' onClick={createTour}>
                        <FontAwesomeIcon icon={faPlus} className='button-icon'></FontAwesomeIcon>
                        Nuevo Paseo
                    </Button>
                </Col>
                <Col>
                    <Button className='primary-button'>
                        <FontAwesomeIcon icon={faRefresh} className='button-icon'></FontAwesomeIcon>
                        Recargar
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}


export default TourList;