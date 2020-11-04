import React, { useState, useEffect, useContext } from 'react';

import './App.css';

import Container from 'react-bootstrap/Container';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import Home from './pages/Home';
import Song from './pages/Song';
import Chart from './pages/Chart';
import Header from './pages/Header';

import { TrailContext } from './context';
import { AuthContext, getUser } from './auth';

function App() {
    const auth = useContext(AuthContext);

    const [trail, setTrail] = useState([]);
    const [user, setUser] = useState(getUser(auth));
    
    useEffect(() => {
        async function perform() {
            setUser(await getUser(auth));
        }
        perform();
    }, [auth]);

    return (
        <Container className="App-container" fluid="md">
            <Router>
                <TrailContext.Provider value={{ entries: trail, set: setTrail }}>
                <AuthContext.Provider value={{ user: user, set: setUser }}>
                <Header />
                <Switch>
                    <Route path="/score/song/:songId" children={<Song />} />
                    <Route path="/score/chart/:chartId" children={<Chart />} />
                    <Route exact path="/score">
                        <Home />
                    </Route>
                </Switch>
                </AuthContext.Provider>
                </TrailContext.Provider>
            </Router>
        </Container>
    );
}

export default App;
