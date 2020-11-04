import React, { useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import './style/Home.scss';

import * as api from '../api';

import KshSubmit from './KshSubmit.js';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

import { TrailContext, TrailItem } from '../context';

function songRow(song, pushSongCallback) {
    return (
        <tr key={song.id} onClick={ pushSongCallback }>
            <td>{song.artist}</td>
            <td>{song.title}</td>
            <td>{song.chart_set.length}</td>
        </tr>
    );
}

export default function Home(props) {
    const trail = useRef(useContext(TrailContext));

    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showSubmitForm, setShowSubmitForm] = useState(false);

    const history = useHistory();
    const pushSong = (s) => history.push({
        pathname: `/score/song/${s.id}`,
        state: { song: s }
    });

    function getSongs() {
        api.getSongs().then(data => {
            setSongs(data['results']);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        trail.current.set([TrailItem.home()]);
    }, []);

    useEffect(getSongs, []);

    return (
        <>
        <Jumbotron>
            <h1>SimpleScore</h1>
            <p>Welcome to the user-sourced internet ranking and chart database service.</p>
        </Jumbotron>
        
        <Container>
            <Row>
                <Col><h1>All songs</h1></Col>
                <Col className="d-flex align-items-center justify-content-end">
                    <Button onClick={ () => setShowSubmitForm(true) }>Submit</Button>
                </Col>
            </Row>
        </Container>
        <KshSubmit
            show={ showSubmitForm }
            closeModalCallback={ () => setShowSubmitForm(false) }
            refreshSongsCallback={ () => getSongs() } />

        { 
        isLoading ? (
            <Spinner animation="border" />
        ) : (
            <Table className="songs" borderless={ true }>
                <thead>
                    <tr>
                        <td>Artist</td>
                        <td>Title</td>
                        <td>Charts</td>
                    </tr>
                </thead>
                <tbody>
                    { songs.map(song => songRow(song, () => pushSong(song))) }
                </tbody>
            </Table>
        )
        }
        </>
    );
};
