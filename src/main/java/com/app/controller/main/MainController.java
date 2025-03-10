package com.app.controller.main;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.ui.Model;

import com.app.dto.main.AvgByDay;
import com.app.dto.main.AvgByRegion;
import com.app.dto.main.CheapJuyuso;
import com.app.service.main.api.ArplApiService;
import com.app.service.main.api.ArplApiService2;
import com.app.service.main.api.ArplApiService3;

@Controller
public class MainController {
	
	@GetMapping("/")
	public String main() {
		
		return "home";
	}

	@GetMapping("/api/cheapJuyuso")
	@ResponseBody
	public List<CheapJuyuso> CheapJuyuso(@RequestParam(required = false) String prodcd, @RequestParam(required = false) String area) {
		
		if (area == null || area.isEmpty()) {
	        area="";
	    }
		
		if (prodcd == null || prodcd.isEmpty()) {
			prodcd="B027";
	    }
		
		List<CheapJuyuso> cheapJuyusoList = null;

		 try {
			cheapJuyusoList = ArplApiService.cheapJuyusoList(area, prodcd); 
		 } catch (Exception e) {	
		    e.printStackTrace();
		 }

		    return cheapJuyusoList; 
	}
	
	@GetMapping("/api/avgByRegion")
	@ResponseBody
	public List<AvgByRegion> avgByRegion(@RequestParam(required = false) String prodcd) {
		
		if (prodcd == null || prodcd.isEmpty()) {
			prodcd="B027";
	    }
		
		List<AvgByRegion> avgList = null;

		 try {
			 avgList = ArplApiService2.avgByRegion(prodcd); 
		 } catch (Exception e) {	
		    e.printStackTrace();
		 }

		    return avgList; 
	}
	
	@GetMapping("/api/avgByDay")
	@ResponseBody
	public List<AvgByDay> avgByDay(@RequestParam(required = false) String area, @RequestParam(required = false) String prodcd) {
		
		if (area == null || area.isEmpty()) {
	        area="";
	    }
		
		if (prodcd == null || prodcd.isEmpty()) {
			prodcd="B027";
	    }
		
		List<AvgByDay> avgList = null;

		 try {
			 avgList = ArplApiService3.avgByDay(area, prodcd); 
		 } catch (Exception e) {	
		    e.printStackTrace();
		 }

		    return avgList; 
	}

}
