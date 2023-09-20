import React, { useEffect,useReducer,useState } from 'react';
import constants from '../../../assets/constants';
import { useNavigate } from "react-router-dom";
import './CreateTour.css';
import apiClient from '../../../services/apiClient'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import moment from 'moment/moment';
import Image from 'react-bootstrap/Image';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

const CreateTour = () => {
    const navigate = useNavigate();

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

    const [cities, setCities] = useState([]);

    const [error, setError] = useState({});

    useEffect(()=>{
        getCities()
        const date = new DateObject()
        date.toDate()
    },[])

    const getCities = async () => {
        const cities = await apiClient.get('/cities')
        setCities(cities)
    }

    const createTour = ()=> {
        console.log(values,values.fecha.map((item)=>moment(item.toDate()).toISOString()))
    }

    const goBack = ()=> {
        navigate(-1)
    }

    const principalImgChange = (file) => {
        if(file.target.files[0].type==='image/jpeg' ||file.target.files[0].type==='image/png' ) {
            getBase64(file.target.files[0])
            .then((result)=>{
                updateValue({fotoPrincipal:result})
            })
        } else {

        }
    }



    const cambioImagenesSecundarias = (files) => {
        if(values.fotosSecundarias.length<=4&&values.fotosSecundarias.length+files.target.files.length<=4) {
            const item = files.target.files[0]
                if(item.type==='image/jpeg' ||item.type==='image/png' ) {
                    getBase64(item)
                    .then((result)=>{
                        updateValue({fotosSecundarias:[...values.fotosSecundarias,result]})
                    })
                } else {
        
            }
        } else {

        }
    }

    const getBase64 = file => {
        return new Promise(resolve => {
          let fileInfo;
          let baseURL = "";
          // Make new FileReader
          let reader = new FileReader();
    
          // Convert the file to base64 text
          reader.readAsDataURL(file);
    
          // on reader load somthing...
          reader.onload = () => {
            // Make a fileInfo Object
            console.log("Called", reader);
            baseURL = reader.result;
            console.log(baseURL);
            resolve(baseURL);
          };
          console.log(fileInfo);
        });
    };

    const deleteImage = (index) => {
        const images = values.fotosSecundarias
        updateValue({fotosSecundarias:images.toSpliced(index,1)})
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
                        maxLength={50}
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
                        <Form.Label column>
                            <DatePicker
                            value={values.fecha}
                            onChange={(date)=>updateValue({fecha:date})}
                            format="DD/MM/YYYY HH:mm"
                            sort
                            multiple
                            plugins={[
                                <TimePicker position="bottom" hideSeconds/>,
                                <DatePanel markFocused />
                            ]}
                            render={
                                <Button className="new" onClick={createTour}>
                                    Editar Fechas
                                </Button>
                            }
                            />
                        </Form.Label>
                        <Col >
                            {
                                values.fecha.map((item)=><Row>{item.format('DD/MM/YYYY HH:mm')}</Row>)
                            }
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
            <Row>
                <Col>
                    <Form.Group as={Row} className="mb-3" controlId="idioma">
                        <Form.Label column>Idioma</Form.Label>
                        <Col >
                            <Form.Select value={values.idioma} onChange={(event) => {
                                updateValue({ idioma: event.target.value})
                            }}>
                                <option value={''}></option>
                                {constants.IDIOMAS.map((item)=><option value={item}>{item}</option>)}
                            </Form.Select>
                        </Col>
                    </Form.Group>
                </Col>
                
                <Col>
                    <Form.Group as={Row} className="mb-3" controlId="ciudad">
                        <Form.Label column>Ciudad</Form.Label>
                        <Col >
                            <Form.Select value={values.ciudad} onChange={(event) => {
                                updateValue({ ciudad: event.target.value})
                            }}>
                                <option value={''}></option>
                                {cities.map((item)=><option value={item.name}>{item.name}</option>)}
                            </Form.Select>
                        </Col>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group as={Row} className="mb-3" controlId="puntoDeEncuentro">
                        <Form.Label column>Punto de Encuentro</Form.Label>
                        <Col >
                        <Form.Control
                        onChange={(event) => {
                            updateValue({puntoDeEncuentro: event.target.value})
                        }}
                        value={values.puntoDeEncuentro}
                        required
                        type="text"
                        maxLength={200}
                        />
                        </Col>
                    </Form.Group>
                </Col>

                <Col>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="fotoPrincipal" className="mb-3">
                        <Form.Label>Imagen Principal</Form.Label>
                        <Col>
                            <input type='file' accept='image/jpeg, image/png' onChange={principalImgChange}></input>
                        </Col>
                    </Form.Group>   
                </Col>
                
                <Col xs={4} md={4}>
                    {values.fotoPrincipal&&<Image src={values.fotoPrincipal} thumbnail  />}
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="fotoPrincipal" className="mb-3">
                        <Form.Label>Fotos Secundarias</Form.Label>
                        <Col>
                            <input type='file' accept='image/jpeg, image/png' onChange={cambioImagenesSecundarias}></input>
                        </Col>
                    </Form.Group>   
                </Col>
                
                
            </Row>
            <Row>
                {values.fotosSecundarias.map((item,index)=>
                    <Col xs={2} md={2} style={{position:'relative'}}>
                        <Button className="delete-img" onClick={()=>deleteImage(index)}>
                            <FontAwesomeIcon style={{color:'red'}} icon={faX}></FontAwesomeIcon>
                        </Button>
                        <Image src={item} thumbnail  />
                    </Col>
                )}
            </Row>
            <Row>
                <Col></Col>
                <Col></Col>

                <Col>
                    <Button className="new" onClick={createTour}>Crear Tour</Button>
                </Col>
                <Col>
                    <Button className="cancel" onClick={goBack}>Cancelar</Button>
                </Col>
            </Row>
        </Container>
    )
}


export default CreateTour;