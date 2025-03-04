import './App.css';
import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

import Main from './pages/main/Main';
import Login from './pages/login/Login';
import Signup from './pages/login/Signup';



function App() {
	return (
		<div>
			<Routes>
				<Route path='/' element={<Main/>}/>
				<Route path='/user/login' element={<Login/>}/>
				<Route path='/user/signup' element={<Signup/>}/>
			</Routes>
		</div>
	);
}

export default App;
