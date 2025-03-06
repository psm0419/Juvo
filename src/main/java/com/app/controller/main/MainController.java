package com.app.controller.main;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.ui.Model;

import com.app.dto.main.CheapJuyuso;
import com.app.service.main.api.ArplApiService;

@Controller
public class MainController {
	
	@GetMapping("/")
	public String main() {
		
		return "home";
	}

	@GetMapping("/api/cheapJuyuso")
	@ResponseBody
	public List<CheapJuyuso> CheapJuyuso(@RequestParam(required = false) String area) {
		
		if (area == null || area.isEmpty()) {
	        area="";
	    }

		String prodcd = "B027"; //휘발유
		
		List<CheapJuyuso> cheapJuyusoList = null;

		 try {
			cheapJuyusoList = ArplApiService.cheapJuyusoList(area, prodcd); 
		 } catch (Exception e) {	
		    e.printStackTrace();
		 }

		    return cheapJuyusoList; 
	}

}
