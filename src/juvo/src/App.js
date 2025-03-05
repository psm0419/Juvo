import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from './pages/main/Main';
import Conversion from './pages/detail/oilinfoDetail/Conversion';
import Tax from './pages/detail/oilinfoDetail/Tax';
import Blackjuyuso from './pages/detail/blackjuyusoDetail/Blackjuyuso';
import Guide from './pages/detail/guideDetail/Guide';
import Law from './pages/detail/guideDetail/Law';
import LocationServiceTerms from './pages/detail/guideDetail/LocationServiceTerms';
import PrivacyPolicy from './pages/detail/guideDetail/PrivacyPolicy';
import RefundPolicy from './pages/detail/guideDetail/RefundPolicy';



function App() {
	return (
		<Routes>
			<Route path="/" element={<Main />} />
			<Route path="/detail/oilinfoDetail/Conversion" element={<Conversion />} />
			<Route path="/detail/oilinfoDetail/Tax" element={<Tax />} />
			<Route path="/detail/blackjuyusoDetail/Blackjuyuso" element={<Blackjuyuso/>} />
			<Route path="/detail/guideDetail/Guide" element={<Guide/>} />
			<Route path="/detail/guideDetail/Law" element={<Law/>} />
			<Route path="/detail/guideDetail/LocationServiceTerms" element={<LocationServiceTerms/>} />
			<Route path="/detail/guideDetail/PrivacyPolicy" element={<PrivacyPolicy/>} />
			<Route path="/detail/guideDetail/RefundPolicy" element={<RefundPolicy/>} />
		</Routes>
	);
}

export default App;
