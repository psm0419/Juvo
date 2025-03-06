package com.app.dto.user;

import lombok.Data;

@Data
public class User {
	String id;
	String pw;
	String username;
	String nickname;
	String email;
	String tel;
	String jumin;
	String user_type;
	int membership;
}
