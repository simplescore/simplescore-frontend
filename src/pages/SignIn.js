import React, { useState, useContext } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import { AuthContext, signInUser } from '../auth';

export default function SignIn(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const auth = useContext(AuthContext);

    function submit() {
        // Sanity check
        if (username.length === 0 || password.length === 0)
            return;

        signInUser(auth, username, password)
            .then(() => props.closeModalCallback());
    }

    return (
        <Modal show={ props.show } onHide={ () => props.closeModalCallback() }>
            <Modal.Header closeButton>
                <Modal.Title>Sign in</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" onChange={ e => setUsername(e.target.value) }/>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" onChange={ e => setPassword(e.target.value) } />
                </Form>
                <Button onClick={ submit }>Confirm</Button>
            </Modal.Body>
        </Modal>
    );
};
