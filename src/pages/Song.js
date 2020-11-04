import React, { useState, useEffect, useContext, useRef } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';

import './style/Song.scss';

import * as api from '../api.js';
import { fetchJson } from '../api.js';
import { locationMaybe } from '../util';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import { TrailContext, TrailItem } from '../context';

export default function SongPage() {
    const trail = useRef(useContext(TrailContext));
    const location = useLocation();

    const { songId } = useParams();
    const [song, setSong] = useState(locationMaybe(location, 'song'));
    const [charts, setCharts] = useState(null);

    const history = useHistory();
    const pushChart = (c) => history.push({
        pathname: `/score/chart/${c.id}`,
        state: {
            song,
            chart: c
        }
    });

    useEffect(() => {
        api.getSong(songId).then(setSong);
    }, [songId]);

    useEffect(() => {
        if (song == null)
            return;

        Promise.all(song.chart_set.map(async c => fetchJson(c)))
            .then(setCharts)
    }, [song]);

    useEffect(() => {
        trail.current.set([TrailItem.home(), TrailItem.song(song)]);
    }, [trail, song]);

    const chartCard = (chart) => {
        return (
            <Card key={chart.id} className="chart-card" style={{ width: '18rem', margin: '1rem 1rem' }}
                onClick={ () => pushChart(chart) }>
                <Card.Body>
                    <Card.Title>{ chart.difficulty_shortname } { chart.difficulty_index }</Card.Title>
                    <Card.Text><i>Effected by</i> { chart.charter }</Card.Text>
                </Card.Body>
            </Card>
        );
    };

    return song == null ? (
        <i>Loading...</i>
    ) : (
        <>
        <Jumbotron>
            <h1>{ song.title }</h1>
            <h3>{ song.artist }</h3>
        </Jumbotron>

        <h2>Charts</h2>

        <Container fluid={true}>
            <Row>
                { charts == null ? (
                    <i>Searching for charts...</i>
                ) : (
                    charts.map(chartCard)
                ) }
            </Row>
        </Container>
        </>
    );
};
