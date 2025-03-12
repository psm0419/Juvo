import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from './pages/main/Main';
import Login from './pages/user/Login';
import Signup from './pages/user/Signup';
import FindId from './pages/user/FindIdRequest';
import MyPageProfile from './pages/user/myPage/MyPageProfile';
import Admin from './pages/admin/Admin';
import MyPageLayout from './pages/user/myPage/MyPageLayout';
import MyPageFavorites from './pages/user/myPage/MyPageFavorites';
import MyPageMembership from './pages/user/myPage/MyPageMembership';
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
import Membership from './pages/detail/guideDetail/Membership';
import MembershipDetail from './pages/detail/guideDetail/MembershipDetail';
import { useTokenCleanup } from './util/AxiosConfig';
import Notice from './pages/detail/guideDetail/Notice';
import NoticeDetail from './pages/detail/guideDetail/NoticeDetail';
import SocialLoginTest from './pages/user/socialLogin/SocialLoginTest';
import KakaoPost from './pages/user/socialLogin/KakaoPost';

function App() {
	useTokenCleanup();
	return (
		<div>
			<Routes>
				<Route path='/' element={<Main />} />
				<Route path='/user/login' element={<Login />} />
				<Route path='/user/signup' element={<Signup />} />

				<Route path='/socialLogin' element={<SocialLoginTest />} />
				<Route path='/login/auth2/code/kakao' element={<KakaoPost />} />
				<Route path="/findPasswordRequest" element={<FindPasswordRequest />} />
				<Route path="/resetPassword/:token" element={<ResetPassword />} />

				<Route path='/findIdRequest' element={<FindId />} />

				<Route path="/admin" element={<Admin />} />

				<Route path="/mypage" element={<MyPageLayout />}>
					<Route path="profile" element={<MyPageProfile />} />
					<Route path="favorites" element={<MyPageFavorites />} />
					<Route path="membership" element={<MyPageMembership />} />
				</Route>

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
				<Route path="/detail/guideDetail/Membership" element={<Membership />} />
				<Route path="/detail/guideDetail/MembershipDetail" element={<MembershipDetail />} />
				<Route path="/detail/guideDetail/Notice" element={<Notice />} />
				<Route path="/detail/guideDetail/Notice/detail/:noticeId" element={<NoticeDetail />} />
				<Route path='/user/login' element={<Login />} />

			</Routes >
		</div>
	);
}

export default App;
