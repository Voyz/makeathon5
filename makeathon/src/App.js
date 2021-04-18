import React, {useState} from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

import './App.css';

import {getPrompts} from './prompts.js'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';

import 'bootstrap/dist/css/bootstrap.min.css';

const apiUrl = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'https://jsonplaceholder.typicode.com/posts';

// const apiUrl = 'https://api.openai.com/v1/engines/davinci/completions';


function App() {
	const [passphrase, setPassphrase] = useState('');
	const [showPassphraseError, setShowPassphraseError] = useState(false);
	const [inputValue, setInputValue] = useState('Some text will be written here as input.');
	const [outputValue, setOutputValue] = useState('This will be the output.');
	const [radioValue, setRadioValue] = useState('1');

	const prompts = getPrompts();
	prompts.then(prompts => {
		console.log(prompts.summary);
		console.log(prompts.sentiment);
	});


	const radios = [
		{name: 'Summary', value: '1'},
		{name: 'List', value: '2'},
	];

	const handleSubmit = event => {
		event.preventDefault();
		console.log('handleSubmit');
		console.log(event);
		console.log(inputValue);
		console.log(radioValue);
		makeRequest(apiUrl, inputValue, radioValue);
	};
	const inputChange = event => {
		setInputValue(event.target.value);
	};

	const decodeApiKey = (apiKey) => {
		console.log(apiKey);
		console.log(passphrase);
		const decrypted = CryptoJS.AES.decrypt(apiKey, passphrase).toString(CryptoJS.enc.Utf8);
		console.log(decrypted);
		return decrypted;
	};

	const makeRequest = async (url, inputText, mode) => {
		console.log('Request:', inputText, mode);

		const options = {
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'Authorization': `Bearer ${decodeApiKey(process.env.REACT_APP_API_KEY_ENCRYPTED)}`
			}
		};

		if (options.headers.Authorization === 'Bearer ') {
			setShowPassphraseError(true);
			console.error('Invalid passphrase.');
			return;
		} else {
			setShowPassphraseError(false);
		}
		console.log(process.env.REACT_APP_API_KEY);
		console.log(options.headers.Authorization);

		try {
			// const response = await axios.post(url,{
			// 	inputText: inputText,
			// 	mode: mode
			// }, options);
			const response = await axios.post(url, {
				"prompt": inputText,
				"engine": "davinci",
				"temperature": 0.25,
				"max_tokens": 120,
				"top_p": 1,
				"frequency_penalty": 0.4,
				"presence_penalty": 0,
				"stop": ["\n"]
			}, options);

			handleResponse(response);

		} catch (e) {
			console.error(e);
		}


	};
	const handleResponse = response => {
		console.log(response);
		setOutputValue(JSON.stringify(response.data));
	};

	return (
		<div className="App">
			<Container fluid
					   className="main_container">
				<Row>
					<Col>
						<img src="/gpteam5_logo.png"
							 className="roundedCircle team_logo"
							 alt="team_logo"/>
					</Col>
				</Row>

				<Row className="mb-4">
					<Col>
						<Form onSubmit={handleSubmit}>
							<Row>
								<Col>
									<Form.Group controlId="exampleForm.ControlTextarea1">
										<Form.Label>Input your full text here:</Form.Label>
										<Form.Control as="textarea"
													  rows={3}
													  value={inputValue}
													  onChange={inputChange}/>
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col>
									<ButtonGroup toggle>
										{radios.map((radio, idx) => (
											<ToggleButton
												key={idx}
												type="radio"
												variant="secondary"
												name="radio"
												value={radio.value}
												checked={radioValue === radio.value}
												onChange={(e) => setRadioValue(e.currentTarget.value)}
											>
												{radio.name}
											</ToggleButton>
										))}
									</ButtonGroup>
								</Col>
								<Col>
									<Button variant="primary"
											type="submit">Submit</Button>
								</Col>
							</Row>
						</Form>
					</Col>
				</Row>

				<Row className="mb-5">
					<Col>
						<Card>
							<Card.Body>{outputValue}</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col>
						<InputGroup size="sm"
									className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text id="inputGroup-sizing-sm">Passphrase</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl aria-label="Small"
										 aria-describedby="inputGroup-sizing-sm"
										 onChange={(e) => setPassphrase(e.currentTarget.value)}/>
						</InputGroup>
					</Col>
				</Row>
				{showPassphraseError &&
				<Row>
					<Col>
						<Alert variant='danger'>
							Invalid passphrase.
						</Alert>
					</Col>
				</Row>
				}
			</Container>
		</div>
	);
}

export default App;
