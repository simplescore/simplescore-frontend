import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import * as api from '../api';
import { fetchJson } from '../api.js';
import { locationMaybe } from '../util';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

import { TrailContext, TrailItem } from '../context';

export default function Chart() {
    const trail = useRef(useContext(TrailContext));
    const location = useLocation();

    const { chartId } = useParams();
    const [song, setSong] = useState(locationMaybe(location, 'song'));
    const [chart, setChart] = useState(locationMaybe(location, 'chart'));
    const [scores, setScores] = useState(null);

    useEffect(() => {
        trail.current.set([TrailItem.home(), TrailItem.song(song), TrailItem.chart(chart)]);
    }, [song, chart]);

    useEffect(() => {
        api.getChart(chartId).then(setChart);
    }, [chartId]);

    useEffect(() => {
        if (chart == null)
            return;
        fetchJson(chart.song).then(setSong);
    }, [chart]);

    useEffect(() => {
        if (chart == null)
            return;
        Promise.all(chart.score_set.map(s => fetchJson(s).then(async res => {
            res.player = await fetchJson(res.player)
            return res;
        }))).then(res => setScores(res));
    }, [chart]);

    function scoreRow(score) {
        return (
            <tr key={score.id}>
                <td>{ score.player.username }</td>
                <td>{ score.display_score }</td>
                <td><i>Not available</i></td>
                <td>{ score.gauge }</td>
                <td>{ score.submission_time }</td>
            </tr>
        );
    }

    return (
        <>
        <Jumbotron>
            {
            (song == null || chart == null) ? (
                <Spinner animation="border" /> 
            ) : (
            <Container>
                <Row>
                    <Col><h1>{ song.title }</h1></Col>
                    <Col className="d-flex justify-content-end">
                        <h2>{ chart.difficulty_name } { chart.difficulty_index }</h2>
                    </Col>
                </Row>
                <Row>
                    <h3>{ song.artist }</h3>
                </Row>
                <Row>
                    <Col className="d-flex justify-content-end">
                        <div><i>#{ chart.sha3.slice(0, 16) }</i></div>
                    </Col>
                </Row>
            </Container>
            )
            }
        </Jumbotron>

        <h1>Scores</h1>
        {
        (scores == null) ? (
            <Spinner animation="border" />
        ) : (
        <Table className="scores">
            <thead>
                <tr>
                    <td>Player</td>
                    <td>Score</td>
                    <td>Judgement</td>
                    <td>Gauge</td>
                    <td>Date</td>
                </tr>
            </thead>
            <tbody>
                { scores.map(score => scoreRow(score)) }
            </tbody>
        </Table>
        )
        }
        </>
    );
};
