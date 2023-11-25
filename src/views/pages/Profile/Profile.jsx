/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect,useState } from 'react';
import './Profile.css';
import apiClient from '../../../services/apiClient'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import {auth, getToken} from '../../../services/googleAuth';
import Image from 'react-bootstrap/Image';
import { Rating } from '@mui/material';
import Pagination from 'react-bootstrap/Pagination';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment/moment';

const Profile = () => {

    const [user,setUser] = useState(null)
    useEffect(()=>{
        auth.authStateReady().then(()=>{
            setUser(auth.currentUser)
            console.log('user',auth.currentUser)
        })
    },[])

    const [comments,setComments] = useState([])
    const [avg,setAvg] = useState(null)
    const [commentsToShow,setComentsToShow] = useState([])
    const [page,setPage] = useState(0)
    const pageSize = 5
    const [cantPages,setPageCant] = useState(0)

    useEffect(()=>{
        if(user&&user.email) getComments(user.email)
    },[user?.email])

    useEffect(()=>{
        console.log('comments',comments)
        if(comments.length) setComentsToShow(comments.slice(page*pageSize,(page+1)*pageSize))
    },[page,comments])

    const getComments = async (email) => {
        if(email)
        try {
            const token = await getToken()
            const tours = await apiClient.get(`/tours?guideEmail=${email}`,{headers:{'token':token}})
            const comments = []
            let avgRating = 0
            for (const tour of tours) {
                const rating = await apiClient.get(`/tours/${tour._id.$oid}`,{headers:{'token':token}})
                avgRating+=rating.averageRating
                const commentList = await apiClient.get(`/reviews/${tour._id.$oid}?state=active`,{headers:{'token':token}})
                comments.push(
                    ...commentList.map((item)=>{
                        return {
                            ...item,
                            name:tour.name
                        }
                    })
                )
            }
            setPageCant(Math.ceil(comments.length/pageSize))
            setComments(comments)
            setAvg(avgRating/tours.length)
        } catch (err) {
            console.log(err)
        }
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

    return(
        <Container>
            <Row>
                <Col>
                    {user&&<Card>
                        <Card.Title style={{backgroundColor:'#4E598C',color:'white',paddingLeft:12}}>Perfil</Card.Title>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Form.Group as={Row} className="mb-3" controlId="tourName">
                                        <Form.Label column>Nombre del Guía</Form.Label>
                                        <Col >
                                        <Form.Control
                                        value={user.displayName}
                                        type="text"
                                        disabled
                                        />
                                        </Col>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group as={Row} className="mb-3" controlId="tourName">
                                        <Form.Label column>Email del Guía</Form.Label>
                                        <Col >
                                        <Form.Control
                                        value={user.email}
                                        type="text"
                                        disabled
                                        />
                                        </Col>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group as={Row} className="mb-3" controlId="tourName">
                                        <Form.Label column>Foto del Guía</Form.Label>
                                        <Image src={user.photoURL} thumbnail style={{maxWidth:250}} />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>}
                </Col>
                
                <Col>
                    <Card>
                        <Card.Title style={{backgroundColor:'#4E598C',color:'white',paddingLeft:12}}>
                            <Row>
                                <Col>Comentarios</Col>
                            </Row>
                        </Card.Title>
                        <Card.Body>
                            {avg&&<Row style={{marginTop:12,marginBottom:12,alignItems:'center'}}>
                                <Col><h2>Valoraciones</h2></Col>
                                <Col><Rating defaultValue={avg} precision={0.1} readOnly /></Col>
                                <Col>Cantidad de Puntuaciones: {comments.length}</Col>
                            </Row>}
                            <Row style={{justifyContent:'center'}}>
                                <h2>Reseñas</h2>
                                {commentsToShow&&commentsToShow.map((item,index)=>{
                                    return <Card style={{paddingLeft:0,paddingRight:0,maxWidth:600,marginBottom:12}} className={item.state==='inactive'?'deactivated-comments':''} key={`${item?._id?.$oid}${index}`}>
                                        <Card.Title style={{color:'white',paddingLeft:8}} className={item.state==='inactive'?'cancel':'commemt'}><Row style={{marginTop:4}} ><Col>{item.userName}</Col><Col style={{fontSize:16}}>{moment(item.date).format('DD/MM/YYYY HH:ss')}</Col><Col>{item.name}</Col></Row></Card.Title>
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
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Profile;
 