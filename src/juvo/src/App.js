import './App.css';
import React from 'react';
import Main from './pages/main/Main';
import {Routes, Route} from 'react-router-dom';
import Juyuso from './pages/juyuso/Juyuso';

function App() {
	return (
		<div>
			<Routes>
				<Route path='/' element={<Main/>}/>
				<Route path='/juyuso' element={<Juyuso/>}/>
			</Routes>
		</div>
	);
}

export default App;
