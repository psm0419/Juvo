package com.app.controller.main;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;

import com.app.service.main.api.ArplApiService;

@Controller
public class MainController {

	@GetMapping("/")
	public String main(Model model) {

		String area = "0101";
		String prodcd = "B027";

		String juyusoList = null;

		try {
			juyusoList = ArplApiService.juyuso(area, prodcd);

			if (juyusoList == null || juyusoList.isEmpty()) {
	            model.addAttribute("message", "데이터가 없습니다.");
	        } else {
	            model.addAttribute("juyusoList", juyusoList);
	        }
		} catch (Exception e) {
	        model.addAttribute("error", "API 호출 중 오류가 발생했습니다.");
	        return "home"; // error.html로 이동
		}

		return "home";
	}

}
