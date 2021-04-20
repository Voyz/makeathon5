import React, {useState} from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

import './App.css';

import {getParams} from './params.js'

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

// const apiUrl = 'https://api.openai.com/v1/engines/[ENGINE]/completions';
// const apiUrl = 'https://jsonplaceholder.typicode.com/posts?[ENGINE]';

let params = null;
getParams().then(p => {
	params = p;
});

// console.log(CryptoJS.AES.encrypt('', 'asdf').toString());

function App() {
	const [passphrase, setPassphrase] = useState('');
	const [inputValue, setInputValue] = useState('Some text will be written here as input.');
	const [outputValue, setOutputValue] = useState('');
	const [sentiment, setSentiment] = useState('');
	const [radioValue, setRadioValue] = useState('1');
	const [errorMessage, setErrorMessage] = useState('');


	const radios = [
		{name: 'Summary', value: '1'},
		{name: 'List', value: '2'},
	];

	const handleSubmit = event => {
		event.preventDefault();
		// console.log('handleSubmit');
		// console.log(event);
		// console.log(inputValue);
		// console.log(radioValue);
		newRequest(apiUrl, inputValue, radioValue);
	};
	const inputChange = event => {
		setInputValue(event.target.value);
	};

	const decodeApiKey = (apiKey) => {
		// console.log(apiKey);
		// console.log(passphrase);
		const decrypted = CryptoJS.AES.decrypt(apiKey, passphrase).toString(CryptoJS.enc.Utf8);
		// console.log(decrypted);
		return decrypted;
	};

	const executeRequest = async (url, options, prompt, requestParams, maxTokens) => {
		const data = {
			"prompt": prompt,
			// "engine": requestParams.engine,
			"temperature": parseFloat(requestParams.temperature),
			"max_tokens": parseFloat(maxTokens),
			"top_p": parseFloat(requestParams.top_p),
			"frequency_penalty": parseFloat(requestParams.frequency_penalty),
			"presence_penalty": parseFloat(requestParams.presence_penalty),
			"stop": ["\n"]
		};
		// console.log(data);
		// return null;
		return await axios.post(url, data, options);
	};

	const newRequest = async (url, inputText, mode) => {
		console.log('Request:', inputText, mode);
		if (inputText === '') {
			setErrorMessage('Provide text to summarise.');
			return false;
		}

		const options = {
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				// 'Authorization': `Bearer ${decodeApiKey(process.env.REACT_APP_API_KEY_ENCRYPTED)}`
				'Authorization': `Bearer ${passphrase}`
			}
		};

		if (options.headers.Authorization === 'Bearer ') {
			setErrorMessage('Provide a valid API key');
			console.error('Invalid API Key.');
			return;
		} else {
			setErrorMessage('');
		}
		// console.log(process.env.REACT_APP_API_KEY);
		// console.log(options.headers.Authorization);

		const maxTokens = Math.ceil(inputText.length / 4);


		const summaryPrompt = `${params.summary.body}\nMessage: ${inputText}\nSummary:`;
		const sentimentPrompt = `${params.sentiment.body}\nMessage: ${inputText}\nSentiment:`;

		// console.log(summaryPrompt);
		// console.log(JSON.stringify(summaryPrompt));

		// console.log(url);
		// console.log(process.env.REACT_APP_API_URL);
		// console.log(process.env.REACT_APP_API_KEY_ENCRYPTED);

		try {
			const summaryUrl = url.replace('[ENGINE]', params.summary.engine);
			var summaryResponse = await executeRequest(summaryUrl, options, summaryPrompt, params.summary, maxTokens)
		} catch (err) {
			if (err.response.status === 401) {
				console.error(`Unauthorised error during summary request: ${url} ${err}`);
				setErrorMessage('Invalid API key.');
			} else {
				console.error(`Error during summary request: ${url} ${err}`);
			}
			return false
		} finally {
			// console.log(summaryResponse);
			if (summaryResponse) {
				handleResponse(summaryResponse, setOutputValue, mode === '2');
			}
		}

		//
		try {
			const sentimentUrl = url.replace('[ENGINE]', params.sentiment.engine);
			var sentimentResponse = await executeRequest(sentimentUrl, options, sentimentPrompt, params.sentiment, params.sentiment.max_tokens);

		} catch (err) {
			console.error(`Error during summary request: ${url} `);
			return false
		} finally {
			// console.log(sentimentResponse);
			if (sentimentResponse) {
				handleResponse(sentimentResponse, setSentiment, false);
			}
		}

	};
	const handleResponse = (response, setter, breakToLines) => {
		try {
			console.log(response);
			try {
				var value = response.data.choices[0].text
			} catch (err) {
				value = JSON.stringify(response.data);
			} finally {

				setter(value);
			}
		} catch (err) {
			console.log(err)
		}
	};


	const OutputBody = () => {
		if (radioValue === '1') {
			return outputValue;
		} else {
			const value = outputValue.split(/(?<=[.!?\n;])/g);
			return <div className="list">{value.map((item, i) => <p key={i}>{item}</p>)}</div>;
		}
	};


	return (
		<div className="App">
			<Container fluid
					   className="">
				<Row className="align-items-center">
					<Col>
						<div className="voiceline_logo_container">
							<img src="/voiceline_transparent.webp"
								 alt="voiceline logo"
								 className="voiceline_logo"/>
						</div>
					</Col>
					<Col>
						<div className="passphrase_input">
							<InputGroup size="sm"
										className="">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">API Key</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl aria-label="Small"
											 aria-describedby="inputGroup-sizing-sm"
											 onChange={(e) => setPassphrase(e.currentTarget.value)}/>
							</InputGroup>
						</div>
					</Col>
				</Row>
				{errorMessage !== '' &&
				<Row>
					<Col>
						<Alert variant='danger'
							   onClose={() => setErrorMessage('')}
							   dismissible>
							{errorMessage}
						</Alert>
					</Col>
				</Row>
				}
			</Container>

			<Container fluid
					   className="main_container">
				<Row className="mb-4">
					<Col>
						<Card className="custom_card">

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
						</Card>
					</Col>
				</Row>
				{outputValue !== '' &&
				<Row className="mb-5">
					<Col>
						<Card className="custom_card output_card">

							<Card.Body>
								<OutputBody></OutputBody>
								<div className="sentiment">
									Sentiment: {sentiment}
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>
				}

				<Row>
					<Col>

					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default App;
