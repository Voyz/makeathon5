import React, {useEffect, useState} from "react";
import axios from "axios";

import logo from './logo.svg';
import './App.css';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import 'bootstrap/dist/css/bootstrap.min.css';

const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

function App() {
	const [inputValue, setInputValue] = useState('Some text will be written here as input.');
	const [outputValue, setOutputValue] = useState('This will be the output.');
	const [radioValue, setRadioValue] = useState('1');
	const radios = [
		{name: 'Mode 1', value: '1'},
		{name: 'Mode 2', value: '2'},
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

	const makeRequest = async (url, inputText, mode) => {
		console.log('Request:', inputText, mode);
		try {
			const options = {
				headers: {'Content-type': 'application/json; charset=UTF-8'}
			};
			const response = await axios.post(url,{
				inputText: inputText,
				mode: mode
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
				<Row>
					<Col>
						<Card>
							<Card.Body>{outputValue}</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>

			<header className="App-header">
				<img src={logo}
					 className="App-logo"
					 alt="logo"/>
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
	);
}

export default App;
