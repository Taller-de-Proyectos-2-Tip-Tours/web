import React, { useEffect } from 'react';
import './ToursList.css';
import apiClient from '../../../services/apiClient'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const TourList = () => {
    useEffect(()=>{
        apiClient.get('/tours')
        .then((result)=>{
            console.log(result)
        })
        .catch(function (error) {
            console.log(error);
        })
    },[])

    return (
        <Container>
            <Row>
                <Col>
                    <Button variant="primary">Primary</Button>
                </Col>
                <Col>
                    <Button variant="primary">Primary</Button>
                </Col>
            </Row>
        </Container>
    )
}


export default TourList;