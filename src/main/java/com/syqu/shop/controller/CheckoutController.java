package com.syqu.shop.controller;
import com.syqu.shop.domain.CheckoutUserInfor;
import com.syqu.shop.domain.OrderData;
import com.syqu.shop.domain.OrderRequestDTO;
import com.syqu.shop.service.CheckoutService;
import com.syqu.shop.service.OrderService;

import java.math.BigDecimal;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class CheckoutController {

    private final CheckoutService checkoutService;
    private final OrderService orderService;

    @Autowired
    public CheckoutController(CheckoutService checkoutService ,OrderService orderService) {
        this.checkoutService = checkoutService;
        this.orderService = orderService;
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

    @PostMapping("/place-order")
    public ResponseEntity<String> placeOrder(@RequestBody OrderRequestDTO orderRequest) {
        if (orderRequest == null) {
            return ResponseEntity.badRequest().body("Order request is null");
        }
        OrderData orderData = new OrderData();
        String username = getCurrentUsername();
        orderData.setUsername(username);
        orderData.setAddress(orderRequest.getAddress().getAddress());
        orderData.setCity(orderRequest.getAddress().getCity());
        orderData.setCountry(orderRequest.getAddress().getCountry());
        orderData.setDistrict(orderRequest.getAddress().getDistrict());
        orderData.setEmail(orderRequest.getAddress().getEmail());
        orderData.setFirstName(orderRequest.getAddress().getFirstName());
        orderData.setLastName(orderRequest.getAddress().getLastName());
        orderData.setMobileNo((orderRequest.getAddress().getMobileNo()));
        orderData.setZipCode((orderRequest.getAddress().getZipCode()));
        // Use a StringBuilder instead of a String for efficiency
        StringBuilder listProductID = new StringBuilder();
        StringBuilder listProductQuantity = new StringBuilder();

        for (int i = 0; i < orderRequest.getProducts().size(); i++) {
            // Append the product ID
            listProductID.append(orderRequest.getProducts().get(i).getId());
            listProductQuantity.append(orderRequest.getProducts().get(i).getQuantity());

            // Append a hyphen if it's not the last item
            if (i < orderRequest.getProducts().size() - 1) {
                listProductID.append("-");
                listProductQuantity.append("-");
            }
        }
         // Set the listProductID as a String
         orderData.setListProductId(listProductID.toString());
         orderData.setListProductQuantity(listProductQuantity.toString());
         // Assuming orderRequest.getTotalPrice() returns a string with a $ sign
        String totalPriceString = orderRequest.getTotalPrice();

        // Remove the $ sign or any other non-numeric characters
        String cleanedTotalPriceString = totalPriceString.replaceAll("[^0-9.-]", "");

        // Convert the cleaned string to BigDecimal
        BigDecimal totalPrice = new BigDecimal(cleanedTotalPriceString);

        // Set the totalPrice in your orderData
        orderData.setTotalPrice(totalPrice);

        // Set the order date (current date and time)
        orderData.setOrderDate(new Date());
        
        orderService.save(orderData);

        return ResponseEntity.ok("Order placed successfully!");
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null; // Or handle anonymous users as needed
    }
}
