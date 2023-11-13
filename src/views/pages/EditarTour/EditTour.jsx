/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect,useReducer,useState } from 'react';
import constants from '../../../assets/constants';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import './EditTour.css';
import apiClient from '../../../services/apiClient'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import Image from 'react-bootstrap/Image';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faX, faStar } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Map, {Marker} from 'react-map-gl';
import {auth, getToken} from '../../../services/googleAuth';
import Loader from '../../utils/Loader/Loader'
import moment from 'moment/moment';
import Pagination from 'react-bootstrap/Pagination';
import { Rating } from '@mui/material';

const EditTour = () => {
    const navigate = useNavigate();
    const { id } = useParams();
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
    const [loading,setLoading] = useState(false)

    const [error, setError] = useReducer(
        (state, update) => ({ ...state, ...update }),
        {
            tourName:'',
            description:'',
            description2:'',
            cupoMinimo:'',
            cupoMaximo:'',
            fecha:'',
            duracion:'',
            idioma:'',
            ciudad:'',
            puntoDeEncuentro:'',
            puntoDeEncuentroLat:'',
            puntoDeEncuentroLon:'',
            fotoPrincipal:'',
            fotosSecundarias:''
        }
    );

    const [modal, showModal] = useState(false);
    const [modalMessage, setModalMessage] = useState(['']);

    const [position, setPosition] = useState(null);
    const [meetingPlace, setMeetingPlace] = useState([]);

    const [modalRemoveMarker, showModalRemoveMarker] = useState(false);
    const [markerToErase, setMarkerToErase] = useState(null);
    
    const [user,setUser] = useState(null)
    const [dates,editDates] = useState(null)
    
    const [cacelarReservaPopUp, showCacelarReservaPopUp] = useState(false);

    
    useEffect(()=>{
        if(markerToErase) showModalRemoveMarker(true);
        setModalMessage('')
    },[markerToErase])

    useEffect(()=>{
        getCities()
        auth.authStateReady().then(()=>{
            setUser(auth.currentUser)
        })
        
    },[])

    useEffect(()=>{
        if(user&&id) searchTours()
    },[user,id])

    const searchTours = async () => {
        setLoading(true)
        const token = 'admin'//await getToken()
        console.log('token',token)
        apiClient.get(`/tours/${id}`,{headers:{"token":token}})
        .then((result)=>{
            setLoading(false)
            if(result) {
                const tour = result;
                console.log(tour.dates)
                editDates(tour.dates.map((item)=>{
                    return {
                        date: new DateObject({date:item.date.replace('T',' '),format:'YYYY-MM-DD HH:mm:ss'}),
                        people:item.people,
                        state:item.state
                    }
                }))
                updateValue({
                    tourName:tour.name,
                    description:tour.description,
                    description2:tour.considerations,
                    cupoMinimo:tour.minParticipants,
                    cupoMaximo:tour.maxParticipants,
                    duracion:tour.duration,
                    idioma:tour.lenguage,
                    ciudad:tour.city,
                    puntoDeEncuentro:tour.meetingPoint,
                    fotoPrincipal:tour.mainImage,
                    fotosSecundarias:tour.otherImages
                })
                const firstStep = tour.stops[0]
                setPosition({
                    lng:firstStep.lon,
                    lat:firstStep.lat,
                    tag:firstStep.tag
                })
                setMeetingPlace(tour.stops.map((item)=>{
                    return {
                        lng:item.lon,
                        lat:item.lat,
                        tag:item.tag
                    }
                }))
            }
        })
        .catch(function (error) {
            console.err(error);
            setLoading(false)
        })
    }


    const getCities = async () => {
        try {
            const token = 'admin' //await getToken()
            const cities = await apiClient.get('/cities',{headers:{'token':token}})
            setCities(cities)
        } catch (err) {
            console.err('getCities',err)
        }
        
    }

    const setMarker = (event) => {
        if(!markerToErase) {
            const markers = [...meetingPlace];
            markers.push(event.lngLat)
            setMeetingPlace(markers)
        }
    }

    const editTour = async ()=> {
        setError(
            {
                tourName:'',
                description:'',
                description2:'',
                cupoMinimo:'',
                cupoMaximo:'',
                fecha:'',
                duracion:'',
                idioma:'',
                ciudad:'',
                puntoDeEncuentro:'',
                puntoDeEncuentroLat:'',
                puntoDeEncuentroLon:'',
                fotoPrincipal:'',
                fotosSecundarias:''
            }
        )
        let invalid = false;
        if(values.tourName==='') {
            invalid = true
            setError({tourName:'Nombre del Paseo es un campo obligatorio'})
        }
        if(values.duracion==='') {
            invalid = true
            setError({duracion:'Duracion es un campo obligatorio'})
        }


        if(values.description.length===0) {
            invalid = true
            setError({description:'La Descripcion es un campo obligatorio'})
        }

        if(values.description2.length===0) {
            invalid = true
            setError({description2:'Los puntos a tener en cuenta son un campo obligatorio'})
        }

        if(parseInt(values.cupoMaximo)<=0) {
            invalid = true
            setError({cupoMaximo:'El Cupo Maximo tiene que ser mayor a 0'})
        }

        if(parseInt(values.cupoMinimo)<=0) {
            invalid = true
            setError({cupoMinimo:'El Cupo Minimo tiene que ser mayor a 0'})
        }

        if(parseInt(values.cupoMaximo)<parseInt(values.cupoMinimo)) {
            invalid = true
            setError({cupoMaximo:'El Cupo Maximo tiene que ser mayor que el cupo Minimo'})
            setError({cupoMinimo:'El Cupo Minimo tiene que ser menor que el cupo Maximo'})
        }

        if(values.ciudad==='') {
            invalid = true
            setError({ciudad:'La Ciudad es un campo obligatorio'})
        }

        if(values.fecha.length===0&&dates.length===0) {
            invalid = true
            setError({fecha:'Tiene que agregar como minimo una fecha'})
        }

        if(values.fotoPrincipal === '') {
            invalid = true
            setError({fotoPrincipal:'Tiene que agregar una foto principal'})
        }

        if(values.fotosSecundarias.length===0) {
            invalid = true
            setError({fotosSecundarias:'Tiene que agregar como minimo una foto secundaria'})
        }

        if(values.puntoDeEncuentro==='') {
            invalid = true
            setError({puntoDeEncuentro:'El punto de encuentro es un campo obligatorio'})
        }
        if(values.idioma==='') {
            invalid = true
            setError({idioma:'El idioma de encuentro es un campo obligatorio'})
        }

        if(meetingPlace.length===0) {
            invalid = true
            setError({meetingPlace:'El punto de Inicio es obligatorio'})
        }

        if(!invalid){
            const data = {
                name:values.tourName,
                duration: values.duracion,
                description: values.description,
                minParticipants: parseInt(values.cupoMinimo),
                maxParticipants: parseInt(values.cupoMaximo),
                city: values.ciudad,
                considerations: values.description2,
                lenguage: values.idioma,
                meetingPoint: values.puntoDeEncuentro,
                dates: [
                    ...dates.map((item)=>{
                        return {
                            date:item.date.format('YYYY-MM-DDTHH:mm:ss'),
                            people:item.people,
                            state:item.state,
                        }
                     }),
                     ...values.fecha.map((item)=>{
                        return {
                            date:item.format('YYYY-MM-DDTHH:mm:ss'),
                            people:0,
                            state:"abierto",
                        }   
                    })],
                mainImage: values.fotoPrincipal,
                otherImages: values.fotosSecundarias,
                stops:meetingPlace.map((item,index)=>{
                    return {
                        lat:item.lat,
                        lon:item.lng,
                        tag:item.tag?item.tag:(index===0?'Inicio':index===(meetingPlace.length-1)?'Fin':'Punto Intermedio'),
                    }
                }),
                guide:{
                    name:user.displayName,
                    email:user.email,
                },
            }
            console.log(data)
            try {
                setLoading(true)
                const token = await getToken()

                await apiClient.put(`/tours/${id}`,data,{headers:{'token':token}})
                setLoading(false)
                navigate(-1)
            } catch (error) {
                setLoading(false)
                let errorMsg = []
                if(error.response) {
                    for(const err in error.response.data) {
                        console.log(err,error)
                        errorMsg.push(`Error: ${Array.isArray(error.response.data[err])?error.response.data[err].join(' '):error.response.data[err]}`)
                    }
                    setModalMessage(errorMsg)
                    showModal(true)
                    setLoading(false)
                    console.log(error.response.data)
                }
                setModalMessage(errorMsg)
                showModal(true)
                setLoading(false)
                console.log(error.response.data)
            }
        }
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
            setError({fotoPrincipal:'El archivo no es image/jpeg o image/png'})
        }
    }



    const cancelarReserva = async (date) => {
        setLoading(true)
        const token = await getToken()
        apiClient.put(`tours/cancel?tourId=${id}&date=${date.format('YYYY-MM-DDTHH:mm:ss')}`,{},{headers:{'token':token}})
        .then((result)=>{
            console.log(result)
            searchTours()
            setModalMessage(['La fecha fue cancelada con éxito.'])
            showModal(true)
            setLoading(false)
            showCacelarReservaPopUp(null)
        }).catch((error)=>{
            setLoading(false)
            showCacelarReservaPopUp(null)
            console.log(error)
            let errorMsg = []
            if(error.response) {
                for(const err in error.response.data) {
                    console.log(err,error)
                    errorMsg.push(`Error: ${Array.isArray(error.response.data[err])?error.response.data[err].join(' '):error.response.data[err]}`)
                }
                setModalMessage(errorMsg)
                showModal(true)
                setLoading(false)
                console.log(error.response.data)
            }
            setModalMessage(errorMsg)
            showModal(true)
            setLoading(false)
        })
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
                    setError({fotosSecundarias:'El archivo no es image/jpeg o image/png'})
            }
        } else {
            setError({fotosSecundarias:'Esta intentando ingresar mas de 4 fotos secundarias'})
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
            <Card>
                <Card.Title style={{backgroundColor:'#4E598C',color:'white',paddingLeft:12}}>Edición de Paseo</Card.Title>
                <Card.Body>
                <Row>
                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="tourName">
                            <Form.Label column className={error.tourName?'error':''}>Nombre del Paseo</Form.Label>
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
                            {error.tourName&&<div className='error'>{error.tourName}</div>}
                        </Form.Group>
                    </Col>

                    <Col>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="description">
                            <Form.Label column className={error.description?'error':''}>Descripción</Form.Label>
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
                            {error.description&&<div className='error'>{error.description}</div>}
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="description2">
                            <Form.Label column className={error.description2?'error':''}>Puntos a tener en cuenta</Form.Label>
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
                            {error.description2&&<div className='error'>{error.description2}</div>}
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="cupoMinimo">
                            <Form.Label column className={error.cupoMinimo?'error':''}>Cupo Mínimo</Form.Label>
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
                            {error.cupoMinimo&&<div className='error'>{error.cupoMinimo}</div>}
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="cupoMaximo">
                            <Form.Label column className={error.cupoMaximo?'error':''}>Cupo Máximo</Form.Label>
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
                            {error.cupoMaximo&&<div className='error'>{error.cupoMaximo}</div>}
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
                                    <Button className={error.fecha?'error':'new'}>
                                        Editar Fechas
                                    </Button>
                                }
                                />
                            </Form.Label>
                            <Col >
                                {
                                    dates&&dates.map((item)=>
                                    <Row>
                                        <Col style={{textAlign:'center'}}>{item.date.format('DD/MM/YYYY HH:mm')}</Col>
                                         
                                        {
                                        item?.state==='abierto'&&
                                        <Col><Button onClick={()=>showCacelarReservaPopUp(item.date)} style={{backgroundColor:'#C11313',textAlign:'center'}}>{item?.people}/{values.cupoMaximo} Cancelar Reserva</Button></Col>
                                        }
                                        {
                                        item?.state!=='abierto'&&<Col><span style={{textAlign:'center'}}>{item?.state} {item?.people}/{values.cupoMaximo}</span></Col>
                                        }
                                    </Row>)
                                }
                                {
                                    values.fecha.map((item)=><Row>{item.format('DD/MM/YYYY HH:mm')}</Row>)
                                }
                            </Col>
                            {error.fecha&&<div className='error'>{error.fecha}</div>}
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="duracion">
                            <Form.Label column className={error.duracion?'error':''}>Duración</Form.Label>
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
                            {error.duracion&&<div className='error'>{error.duracion}</div>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="idioma">
                            <Form.Label column className={error.idioma?'error':''}>Idioma</Form.Label>
                            <Col >
                                <Form.Select value={values.idioma} onChange={(event) => {
                                    updateValue({ idioma: event.target.value})
                                }}>
                                    <option value={''}></option>
                                    {constants.IDIOMAS.map((item)=><option value={item}>{item}</option>)}
                                </Form.Select>
                            </Col>
                            {error.idioma&&<div className='error'>{error.idioma}</div>}
                        </Form.Group>
                    </Col>
                    
                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="ciudad">
                            <Form.Label column className={error.ciudad?'error':''}>Ciudad</Form.Label>
                            <Col >
                                <Form.Select value={values.ciudad} onChange={(event) => {
                                    updateValue({ ciudad: event.target.value})
                                }}>
                                    <option value={''}></option>
                                    {cities.map((item)=><option value={item.name}>{item.name}</option>)}
                                </Form.Select>
                            </Col>
                            {error.ciudad&&<div className='error'>{error.ciudad}</div>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="puntoDeEncuentro">
                            <Form.Label column className={error.puntoDeEncuentro?'error':''}>Detalles de Encuentro</Form.Label>
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
                            {error.puntoDeEncuentro&&<div className='error'>{error.puntoDeEncuentro}</div>}
                        </Form.Group>
                    </Col>

                    <Col>
                    </Col>
                </Row>
                <Row>
                {position&&
                        <Map
                        mapboxAccessToken={constants.MAP_BOX_KEY}
                        initialViewState={{
                            longitude: position.lng,
                            latitude: position.lat,
                            zoom: 14
                        }}
                        style={{width: 600, height: 400}}
                        mapStyle="mapbox://styles/mapbox/streets-v9"
                        onClick={setMarker}
                        >
                            {meetingPlace.map((item,index)=>{
                                return(
                                    <Marker key={`${item.lng}&${item.lat}`} longitude={item.lng} latitude={item.lat} onClick={()=>{
                                        setMarkerToErase(index)
                                    }}></Marker>
                                )
                            })
                            }
                        </Map>
                }
                </Row>
                <Row>
                    {error.meetingPlace&&<div className='error'>{error.meetingPlace}</div>}
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="fotoPrincipal" className="mb-3">
                            <Form.Label className={error.fotoPrincipal?'error':''}>Imagen Principal</Form.Label>
                            <Col>
                                <input type='file' accept='image/jpeg, image/png' onChange={principalImgChange}></input>
                            </Col>
                        </Form.Group>   
                    </Col>
                    
                    <Col xs={4} md={4}>
                        {values.fotoPrincipal&&<Image src={values.fotoPrincipal} thumbnail  />}
                    </Col>
                    {error.fotoPrincipal&&<div className='error'>{error.fotoPrincipal}</div>}
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="fotoPrincipal" className="mb-3">
                            <Form.Label className={error.fotosSecundarias?'error':''}>Fotos Secundarias</Form.Label>
                            <Col>
                                <input type='file' accept='image/jpeg, image/png' onChange={cambioImagenesSecundarias}></input>
                            </Col>
                        </Form.Group>   
                    </Col>
                    {error.fotosSecundarias&&<div className='error'>{error.fotosSecundarias}</div>}
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
                        <Button className="new" onClick={editTour}>Guardar</Button>
                    </Col>
                    <Col>
                        <Button className="cancel" onClick={goBack}>Cancelar</Button>
                    </Col>
                </Row>
                </Card.Body>
            </Card>
            
            {modal&&<div
                className="modal show modal-full-page"
            >
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>Edicion del Paseo</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {modalMessage.map((item)=><p>{item}</p>)}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>showModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal.Dialog>
            </div>}

            {modalRemoveMarker&&<div
                className="modal show modal-full-page"
            >
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>¿Quitar Marcador?</Modal.Title>
                </Modal.Header>

                <Modal.Footer>
                    <Button variant="primary" onClick={()=>{
                        setMeetingPlace(meetingPlace.toSpliced(markerToErase,1))
                        showModalRemoveMarker(null)
                        setMarkerToErase(null);
                    }}>Confirmar</Button>
                    <Button variant="secondary" onClick={()=>{
                        setMarkerToErase(null);
                        showModalRemoveMarker(false)
                    }}>Cerrar</Button>
                </Modal.Footer>
            </Modal.Dialog>
            </div>}
            {cacelarReservaPopUp&&<div
                className="modal show modal-full-page"
            >
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>¿Quiere Cancelar la reserva?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Si cancela la Fecha se enviará una notificacion a las personas anotadas
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={()=>{
                        cancelarReserva(cacelarReservaPopUp)
                    }}>Confirmar</Button>
                    <Button variant="secondary" onClick={()=>{
                        showCacelarReservaPopUp(null)
                    }}>Cerrar</Button>
                </Modal.Footer>
            </Modal.Dialog>
            </div>}
        {loading&&<Loader></Loader>}
        </Container>
    )
}


export default EditTour;