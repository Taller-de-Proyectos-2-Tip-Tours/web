import React, { useEffect,useReducer,useState } from 'react';
import './CreateTour.css';
import apiClient from '../../../services/apiClient'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons';
import constants from '../../../assets/constants';
import Form from 'react-bootstrap/Form';

const CreateTour = () => {
    const [values, updateValue] = useReducer(
        (state, update) => ({ ...state, ...update }),
        {
            tourName:'',
            description:'',
            description2:'',
            cupoMinimo:0,
            cupoMaximo:0,
            fecha:[],
            duracion:'',
            idioma:'',
            ciudad:'',
            puntoDeEncuentro:'',
            puntoDeEncuentroLat:'',
            puntoDeEncuentroLon:'',
            fotoPrincipal:'',
            fotosSecundarias:[]
        }
    );

    const [cities, setCities] = useState(true);

    useEffect(()=>{
        getCities()
    },[])

    const getCities = async () => {
        const cities = await apiClient.get('/cities')
        console.log('cities',cities)
        setCities(cities)
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Form.Group as={Row} className="mb-3" controlId="tourName">
                        <Form.Label column>Nombre del Tour</Form.Label>
                        <Col >
                        <Form.Control
                        onChange={(event) => {
                            updateValue({tourName: event.target.value})
                        }}
                        value={values.tourName}
                        required
                        type="text"
                        />
                        </Col>
                    </Form.Group>
                </Col>

                <Col>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group as={Row} className="mb-3" controlId="description">
                        <Form.Label column>Descripcion</Form.Label>
                        <Col >
                        <Form.Control
                        value={values.description}
                        maxLength={200}
                        onChange={(event) => {
                            updateValue({description: event.target.value})
                        }}
                            as="textarea"
                        />
                        </Col>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group as={Row} className="mb-3" controlId="description2">
                        <Form.Label column>Puntos a tener en cuenta</Form.Label>
                        <Col >
                        <Form.Control
                        value={values.description2}
                        maxLength={200}
                        onChange={(event) => {
                            updateValue({description2: event.target.value})
                        }}
                            as="textarea"
                        />
                        </Col>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group as={Row} className="mb-3" controlId="cupoMinimo">
                        <Form.Label column>Cupo Minimo</Form.Label>
                        <Col >
                        <Form.Control
                        value={values.cupoMinimo}
                        required
                        onChange={(event) => {
                            updateValue({cupoMinimo: event.target.value})
                        }}
                        type="number"
                        />
                        </Col>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group as={Row} className="mb-3" controlId="cupoMaximo">
                        <Form.Label column>Cupo Maximo</Form.Label>
                        <Col >
                        <Form.Control
                        required
                        value={values.cupoMaximo}
                        onChange={(event) => {
                            updateValue({cupoMaximo: event.target.value})
                        }}
                        type="number"
                        />
                        </Col>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group as={Row} className="mb-3" controlId="fecha">
                        <Form.Label column>Fechas</Form.Label>
                        <Col >
                        </Col>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group as={Row} className="mb-3" controlId="duracion">
                        <Form.Label column>Duracion</Form.Label>
                        <Col >
                        <Form.Control
                        required
                        value={values.duracion}
                        onChange={(event) => {
                            updateValue({duracion: event.target.value})
                        }}
                        type="time"
                        />
                        </Col>
                    </Form.Group>
                </Col>
            </Row>
        </Container>
    )
}


export default CreateTour;