import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from './pages/main/Main';
import Conversion from './pages/detail/oilinfoDetail/Conversion';
import Tax from './pages/detail/oilinfoDetail/Tax';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Main />} />
			<Route path="/detail/oilinfoDetail/Conversion" element={<Conversion />} />
			<Route path="/detail/oilinfoDetail/Tax" element={<Tax />} />
		</Routes>
	);
}

export default App;
