package com.app.dto.user;

import lombok.Data;

@Data
public class ResetPasswordRequest {
	private String token;
    private String newPassword;
}
