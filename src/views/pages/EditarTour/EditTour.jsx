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
import {auth} from '../../../services/googleAuth';
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
    const [comments,setComents] = useState([])
    const [commentsToShow,setComentsToShow] = useState([])
    const [rating,setRating] = useState(null)

    const [page,setPage] = useState(0)
    const [pageSize,setPageSize] = useState(5)
    const [cantPages,setPageCant] = useState(0)
    
    
    useEffect(()=>{
        if(markerToErase) showModalRemoveMarker(true);
        setModalMessage('')
    },[markerToErase])

    useEffect(()=>{
        getCities()
        navigator.geolocation.getCurrentPosition(getPositionSuccess, getPositionError);

        auth.authStateReady().then(()=>{
            setUser(auth.currentUser)
        })
        
    },[])

    useEffect(()=>{
        if(user&&id) searchTours()
        if(user&&id) getComments()
    },[user,id])

    const searchTours = () => {
        setLoading(true)
        apiClient.get(`/tours?guideEmail=${user.email}`)
        .then((result)=>{
            setLoading(false)
            console.log(id,result.filter((item)=>item._id.$oid===id))
            const tours = result.filter((item)=>item._id.$oid===id)
            if(tours&&tours.length>0) {
                const tour = tours[0];
                console.log(tour.dates)
                updateValue({
                    tourName:tour.name,
                    description:tour.description,
                    description2:tour.considerations,
                    cupoMinimo:tour.minParticipants,
                    cupoMaximo:tour.maxParticipants,
                    fecha:tour.dates.map((item)=>{
                        return {
                            date: new DateObject({date:item.date.replace('T',' '),format:'YYYY-MM-DD HH:mm:ss'}),
                            people:item.people,
                            state:item.state
                        }
                    }),
                    duracion:tour.duration,
                    idioma:tour.lenguage,
                    ciudad:tour.city,
                    puntoDeEncuentro:tour.meetingPoint,
                    fotoPrincipal:tour.mainImage,
                    fotosSecundarias:tour.otherImages
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
            console.log(error);
            setLoading(false)
        })
    }

    const getComments = () => {
        apiClient.get(`/reviews/${id}?state=active`)
        .then((result)=>{
            setComentsToShow(result.slice(page*pageSize,(page+1)*pageSize))
            setPageCant(Math.ceil(result.length/pageSize))

            
            console.log('rating',rating)
            setComents([...result])
        })
    }

    useEffect(()=>{
        if(comments.length>0) {
            let rating = 0
            const notCero = comments.filter((item)=>item.stars!==0)
            rating = notCero.map(item=>item.stars).reduce((prev,curr)=>prev+curr)
            setRating(rating)
        }
    },[comments])

    useEffect(()=>{
        if(comments.length) setComentsToShow(comments.slice(page*pageSize,(page+1)*pageSize))
    },[page])

    const getPositionSuccess = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setPosition({lat:latitude,lng:longitude})
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }
      
    const getPositionError = () => {
        console.log("Unable to retrieve your location");
    }

    const getCities = async () => {
        const cities = await apiClient.get('/cities')
        setCities(cities)
    }

    const setMarker = (event) => {
        if(!markerToErase) {
            const markers = [...meetingPlace];
            markers.push(event.lngLat)
            setMeetingPlace(markers)
        }
    }

    const editTour = ()=> {
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

        if(values.fecha.length===0) {
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
                duration: values.duracion,
                description: values.description,
                minParticipants: values.cupoMinimo,
                maxParticipants: values.cupoMaximo,
                city: values.ciudad,
                considerations: values.description2,
                lenguage: values.idioma,
                meetingPoint: values.puntoDeEncuentro,
                dates: values.fecha.map((item)=>item.format('YYYY-MM-DDTHH:mm:ss')),
                mainImage: values.fotoPrincipal,
                otherImages: values.fotosSecundarias,
                markers:meetingPlace.map((item)=>{
                    return {
                        lat:item.lat,
                        lon:item.lng,
                        tag:'',
                    }
                }),
                guide:{
                    name:user.displayName,
                    email:user.email,
                }
            }
            console.log(data)
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

    const cancelarReserva = (date) => {
        setLoading(true)
        apiClient.put(`tours/cancel?tourId=${id}&date=${date.format('YYYY-MM-DDTHH:mm:ss')}`)
        .then((result)=>{
            console.log(result)
            searchTours()
            setModalMessage(['La fecha fue cancelada con éxito.'])
            showModal(true)
            setLoading(false)
        }).catch((err)=>{
            setLoading(false)
            console.log(err)
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

    const getPaginationItems = () => {
        const items = []
        for(let i = 0; i < cantPages;i++) {
            items.push(
                <Pagination.Item key={i} active={i === page} onClick={()=>{setPage(i)}}>
                    {i+1}
                </Pagination.Item>
            )
        } 
        return items
    }

    return (
        <Container>
            <Card>
                <Card.Title style={{backgroundColor:'#4E598C',color:'white',paddingLeft:12}}>Edicion de Paseo</Card.Title>
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
                            <Form.Label column className={error.description?'error':''}>Descripcion</Form.Label>
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
                            <Form.Label column className={error.cupoMinimo?'error':''}>Cupo Minimo</Form.Label>
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
                            <Form.Label column className={error.cupoMaximo?'error':''}>Cupo Maximo</Form.Label>
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
                                value={values.fecha.map((item)=>item.date)}
                                onChange={(date)=>updateValue({fecha:{date:date}})}
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
                                    values.fecha.map((item)=>
                                    <Row>
                                        <Col style={{textAlign:'center'}}>{item.date.format('DD/MM/YYYY HH:mm')}</Col>
                                         
                                        {
                                        item?.state==='abierto'&&
                                        <Col><Button onClick={()=>cancelarReserva(item.date)} style={{backgroundColor:'#C11313',textAlign:'center'}}>{item?.people}/{values.cupoMaximo} Cancelar Reserva</Button></Col>
                                        }
                                        {
                                        item?.state!=='abierto'&&<Col><span style={{textAlign:'center'}}>{item?.state} {item?.people}/{values.cupoMaximo}</span></Col>
                                        }
                                    </Row>)
                                }
                            </Col>
                            {error.fecha&&<div className='error'>{error.fecha}</div>}
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="duracion">
                            <Form.Label column className={error.duracion?'error':''}>Duracion</Form.Label>
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
                {rating&&<Row style={{marginTop:12,marginBottom:12,alignItems:'center'}}>
                    <Col><h2>Valoraciones</h2></Col>
                    <Col><Rating defaultValue={rating} precision={0.5} readOnly /></Col>
                </Row>}
                <Row style={{justifyContent:'center'}}>
                    <h2>Reseñas</h2>
                    {commentsToShow&&commentsToShow.map((item,index)=>{
                        return <Card style={{paddingLeft:0,paddingRight:0,maxWidth:600}} key={`${item?._id?.$oid}${index}`}>
                            <Card.Title style={{backgroundColor:'#4E598C',color:'white',paddingLeft:8}}><Row style={{marginTop:4}}><Col>{item.userName}</Col><Col style={{fontSize:16}}>{moment(item.date).format('DD/MM/YYYY HH:ss')}</Col></Row></Card.Title>
                            <Card.Body>
                                <Row>{item.comment}</Row>
                                <Row><span style={{justifyContent:'end',display:'flex',alignItems:'center'}}>{item.stars}<FontAwesomeIcon style={{color:'#caca03'}} icon={faStar}></FontAwesomeIcon></span></Row>
                            </Card.Body>
                        </Card>
                    })}
                </Row>
                {comments&&
                    <Pagination style={{justifyContent:'center'}}>
                        <Pagination.First onClick={()=>setPage(0)} />
                        <Pagination.Prev onClick={()=>{
                            if(page-1>=0) {
                                setPage(page-1)
                            }
                        }}/>
                        {getPaginationItems()}
                        <Pagination.Next  onClick={()=>{
                            if(page+1<cantPages) {
                                setPage(page+1)
                            }
                        }}/>
                        <Pagination.Last onClick={()=>setPage(cantPages-1)}/>
                    </Pagination>
                }
                <Row>
                    <Col></Col>
                    <Col></Col>

                    <Col>
                        <Button className="new" onClick={editTour}>Editar Paseo</Button>
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
                        showModalRemoveMarker(false)
                        setMarkerToErase(null);
                    }}>Confirmar</Button>
                    <Button variant="secondary" onClick={()=>{
                        setMarkerToErase(null);
                        showModalRemoveMarker(false)
                    }}>Cerrar</Button>
                </Modal.Footer>
            </Modal.Dialog>
            </div>}
        {loading&&<Loader></Loader>}
        </Container>
    )
}


export default EditTour;