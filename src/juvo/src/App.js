import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from './pages/main/Main';
import Login from './pages/user/Login';
import Signup from './pages/user/Signup';
import FindId from './pages/user/FindIdRequest';
import MyPageProfile from './pages/user/myPage/MyPageProfile';
import Admin from './pages/admin/Admin';
import FindPassword from './pages/user/FindPasswordRequest';
import Conversion from './pages/detail/oilinfoDetail/Conversion';
import Tax from './pages/detail/oilinfoDetail/Tax';
import Blackjuyuso from './pages/detail/blackjuyusoDetail/Blackjuyuso';
import Guide from './pages/detail/guideDetail/Guide';
import Law from './pages/detail/guideDetail/Law';
import Juyuso from './pages/juyuso/Juyuso';
import LocationServiceTerms from './pages/detail/guideDetail/LocationServiceTerms';
import PrivacyPolicy from './pages/detail/guideDetail/PrivacyPolicy';
import RefundPolicy from './pages/detail/guideDetail/RefundPolicy';
import Faq from './pages/detail/guideDetail/Faq';
import FaqDetail from './pages/detail/guideDetail/FaqDetail';
import FindPasswordRequest from './pages/user/FindPasswordRequest';
import ResetPassword from './pages/user/ResetPassword';




function App() {
	return (
		<div>
			<Routes>
				<Route path='/' element={<Main />} />
				<Route path='/user/login' element={<Login />} />
				<Route path='/user/signup' element={<Signup />} />

				<Route path="/findPasswordRequest" element={<FindPasswordRequest />} />
				<Route path="/resetPassword/:token" element={<ResetPassword />} />

				<Route path='/findIdRequest' element={<FindId />} />

				<Route path="/user/myPage/profile" element={<MyPageProfile />} />

				<Route path="/admin" element={<Admin />} />


				<Route path="/detail/oilinfoDetail/Conversion" element={<Conversion />} />
				<Route path="/detail/oilinfoDetail/Tax" element={<Tax />} />
				<Route path="/detail/blackjuyusoDetail/Blackjuyuso" element={<Blackjuyuso />} />
				<Route path="/detail/guideDetail/Guide" element={<Guide />} />
				<Route path="/detail/guideDetail/Law" element={<Law />} />
				<Route path="/juyuso" element={<Juyuso />} />
				<Route path="/detail/guideDetail/LocationServiceTerms" element={<LocationServiceTerms />} />
				<Route path="/detail/guideDetail/PrivacyPolicy" element={<PrivacyPolicy />} />
				<Route path="/detail/guideDetail/RefundPolicy" element={<RefundPolicy />} />
				<Route path="/detail/guideDetail/faq" element={<Faq />} />
				<Route path="/detail/guideDetail/faq/:id" element={<FaqDetail />} />
				<Route path='/user/login' element={<Login />} />
			</Routes >
		</div>
	);
}

export default App;
