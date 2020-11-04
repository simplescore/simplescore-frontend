import React, { useState, useContext } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Spinner from 'react-bootstrap/Spinner';

import SignIn from './SignIn';

import { TrailContext } from '../context';
import { AuthContext } from '../auth';

export default function Header() {
    const [showSigninModal, setShowSigninModal] = useState(false);

    const trail = useContext(TrailContext);
    const auth = useContext(AuthContext);

    function $breadCrumbEntries() {
        const children = [];
        for (let entry of trail.entries) {
            if (entry.name == null) {
                children.push((<Breadcrumb.Item><Spinner key="spinner" animation="border" /></Breadcrumb.Item>));
                break;
            }
            children.push((<Breadcrumb.Item key={entry.name} href={ entry.href }>{ entry.name }</Breadcrumb.Item>));
        }
        return children;
    }

    function $loginNode() {
        if (auth.user == null)
            return (<Button onClick={ () => setShowSigninModal(true) }>Sign in</Button>)
        else
            return (<div>Logged in as <b>{auth.user.username}</b></div>)
    }

    return (
        <>
        <SignIn show={ showSigninModal } closeModalCallback={ () => setShowSigninModal(false) } />

        <Container fluid={true}>
            <Row>
                <Col className="d-flex align-items-center">
                    <Breadcrumb>
                        {$breadCrumbEntries()}
                    </Breadcrumb>
                </Col>
                <Col className="d-flex align-items-center justify-content-end">{$loginNode()}</Col>
            </Row>
        </Container>
        </>
    )
}
