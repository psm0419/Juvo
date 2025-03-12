package com.app.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.juyuso.BlackJuyuso;
import com.app.dto.user.User;
import com.app.service.juyuso.JuyusoService;
import com.app.service.user.UserService;

@Controller
public class AdminController {
	
	@Autowired
	UserService userService;
	
	@Autowired
	JuyusoService juyusoService;
	
	@GetMapping("/api/admin/user")
	@ResponseBody
	public List<User> user() {
		
		try {
	        List<User> userList = userService.findUserList();
	        if (userList == null) {
	            System.out.println("userList is null");
	            return List.of(); // null 대신 빈 리스트 반환
	        }
	        System.out.println(userList);
	        return userList;
	    } catch (Exception e) {
	        System.err.println("Error in getUserList: " + e.getMessage());
	        e.printStackTrace();
	        return List.of(); // 오류 발생 시 빈 리스트 반환
	    }
	}
	
	@GetMapping("/api/admin/removeUser")
	@ResponseBody
	public  String removeUser(@RequestParam("id")String id) {
		
		try {
			int result = userService.removeUser(id);
			if (result > 0) {
				System.out.println("User deleted: " + id);
				return "success";
			} else {
				System.out.println("User not found: " + id);
				return "failure";
			}
		} catch (Exception e) {
			System.err.println("Error in deleteUser: " + e.getMessage());
			e.printStackTrace();
			return "error";
		}
	}
	
	@GetMapping("/api/admin/findProcessedBlack")
	@ResponseBody
	public List<BlackJuyuso> findProcessedBlack() {
		try {
	        List<BlackJuyuso> blackList = juyusoService.findProcessedBlackList();
	        if (blackList == null) {
	            System.out.println(" processed blackList is null");
	            return List.of(); // null 대신 빈 리스트 반환
	        }
	        System.out.println(blackList);
	        return blackList;
	    } catch (Exception e) {
	        System.err.println("Error in get processed blackList: " + e.getMessage());
	        e.printStackTrace();
	        return List.of(); // 오류 발생 시 빈 리스트 반환
	    }
	}
	
	@GetMapping("/api/admin/findBlack")
	@ResponseBody
	public List<BlackJuyuso> findBlack() {
		try {
	        List<BlackJuyuso> blackList = juyusoService.findBlackList();
	        if (blackList == null) {
	            System.out.println("blackList is null");
	            return List.of(); // null 대신 빈 리스트 반환
	        }
	        System.out.println(blackList);
	        return blackList;
	    } catch (Exception e) {
	        System.err.println("Error in get blackList: " + e.getMessage());
	        e.printStackTrace();
	        return List.of(); // 오류 발생 시 빈 리스트 반환
	    }
	}
	
	@PostMapping("/api/admin/modifyBlack")
	@ResponseBody
	public String saveBlack(@RequestBody BlackJuyuso blackJuyuso) {
		
		try {
			int result = juyusoService.modifyBlack(blackJuyuso);
			if (result > 0) {
				System.out.println("Black modified: " + blackJuyuso);
				return "success";
			} else {
				System.out.println("Black not modified: " + blackJuyuso);
				return "failure";
			}
		} catch (Exception e) {
			System.err.println("Error in removeBlack: " + e.getMessage());
			e.printStackTrace();
			return "error";
		}
	}
	
	@GetMapping("/api/admin/removeBlack")
	@ResponseBody
	public  String removeBlack(@RequestParam("uniId")String uniId) {
		
		try {
			int result = juyusoService.removeBlack(uniId);
			if (result > 0) {
				System.out.println("Black deleted: " + uniId);
				return "success";
			} else {
				System.out.println("Black not found: " + uniId);
				return "failure";
			}
		} catch (Exception e) {
			System.err.println("Error in removeBlack: " + e.getMessage());
			e.printStackTrace();
			return "error";
		}
	}

}
