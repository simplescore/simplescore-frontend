import React, { useState, useContext } from 'react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import { readFileAsync } from '../ksh.js';
import { submitChartContents } from '../api.js';
import { AuthContext } from '../auth';

export default function KshSubmitForm(props) {
    const auth = useContext(AuthContext);

    const [selectedFile, setSelectedFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleFileChange = (e) => {
        setAlert(null);
        if (e.target.files.length > 0)
            setSelectedFile(e.target.files[0]);
    };

    const submitFile = async () => {
        if (selectedFile == null)
            throw new Error('no file');

        setIsProcessing(true);
        let submission = await readFileAsync(selectedFile);
        let submissionResponse = await submitChartContents(auth, selectedFile.name, submission);
        setIsProcessing(false);

        if (!submissionResponse.ok) {
            let contents = await submissionResponse.json(); 
            setAlert(contents.detail);
            return;
        }

        props.refreshSongsCallback();
        props.closeModalCallback();
    };

    return (
        <Modal show={ props.show } onHide={ () => props.closeModalCallback() }>
            <Modal.Header closeButton>
                <Modal.Title>Submit KSH</Modal.Title>
            </Modal.Header>

            { alert ? <Alert variant="danger">{ alert }</Alert> : null }

            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.File label="Choose a file" onChange={ handleFileChange } />
                    </Form.Group>
                </Form>
                <Button onClick={ submitFile }>Confirm</Button>
            </Modal.Body>
        </Modal>
    );
}
