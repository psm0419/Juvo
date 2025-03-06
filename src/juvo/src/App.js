import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Main from './pages/main/Main';
import Login from './pages/user/Login';
import Signup from './pages/user/Signup';
import FindId from './pages/user/FindId';
import MyPage from './pages/user/MyPage';
import FindPassword from './pages/user/FindPassword';



function App() {
	return (
		<div>
			<Routes>
				<Route path='/' element={<Main/>}/>
				<Route path='/user/login' element={<Login/>}/>
				<Route path='/user/signup' element={<Signup/>}/>
				<Route path='/user/findPassword' element={<FindPassword/>}/>
				<Route path='/user/findId' element={<FindId/>}/>
				<Route path='/user/myPage' element={<MyPage/>}/>
			</Routes>
		</div>
	);
}

export default App;
