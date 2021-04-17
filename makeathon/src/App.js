import React, {useEffect, useState} from "react";

import logo from './logo.svg';
import './App.css';

import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
	const [inputValue, setInputValue] = useState('');
	const handleSubmit = event => {
		event.preventDefault();
		console.log('handleSubmit');
		console.log(event);
		console.log(inputValue);
	};
	const handleChange = event => {
		setInputValue(event.target.value);
	};


	return (
		<div className="App">
			<Container fluid className="main_container">
				<row>
					<img src="/gpteam5_logo.png"
						 className="roundedCircle team_logo"
						 alt="team_logo"/>
				</row>
				<row>
					<Form onSubmit={handleSubmit}>
						<Form.Group controlId="exampleForm.ControlTextarea1">
							<Form.Label>Input your full text here:</Form.Label>
							<Form.Control as="textarea"
										  rows={3}
										  value={inputValue}
										  onChange={handleChange}/>
						</Form.Group>
						<Button variant="primary"
								type="submit">Submit</Button>
					</Form>
				</row>
				<row>
					<Card>
						<Card.Body>This is some text within a card body.</Card.Body>
					</Card>
				</row>
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
