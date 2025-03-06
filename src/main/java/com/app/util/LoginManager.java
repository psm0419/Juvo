package com.app.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class LoginManager {

	public static final String SESSION_LOGIN_KEY = "loginUserId";
	
	public static void setSessionLogin(HttpSession session, String id) {
		session.setAttribute(SESSION_LOGIN_KEY, id);
	}
	
	public static void setSessionLogin(HttpServletRequest request, String id) {
		setSessionLogin(request.getSession(), id);
	}
	
	public static boolean isLogin(HttpSession session) {
		if(session.getAttribute(SESSION_LOGIN_KEY) != null)
			return true;
		
		return false;
	}
	
	public static boolean isLogin(HttpServletRequest request) {
		return isLogin(request.getSession());
	}
	
	
	public static String getLoginUserId(HttpSession session) {
		return (String)session.getAttribute(SESSION_LOGIN_KEY);
	}
	
	public static String getLoginUserId(HttpServletRequest request) {
		return getLoginUserId(request.getSession());
	}
	
	public static void logout(HttpSession session) {
		session.invalidate();
	}
	
	public static void logout(HttpServletRequest request) {
		logout(request.getSession());
	}
}













