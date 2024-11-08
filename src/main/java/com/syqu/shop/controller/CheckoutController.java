package com.syqu.shop.controller;

import com.syqu.shop.domain.CheckoutUserInfor;
import com.syqu.shop.service.CheckoutService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class CheckoutController {

    private final CheckoutService checkoutService;

    @Autowired
    public CheckoutController(CheckoutService checkoutService ) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/saveAddress")
    @ResponseBody
    public ResponseEntity<String> saveAddress(@RequestBody CheckoutUserInfor checkoutUserInfor) {
        String username = getCurrentUsername();
        Long id = checkoutUserInfor.getId();
        checkoutUserInfor.setUsername(username);
        checkoutService.updateUserInfoById( id, checkoutUserInfor);
        return ResponseEntity.ok("Address saved successfully");
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null; // Or handle anonymous users as needed
    }
}
