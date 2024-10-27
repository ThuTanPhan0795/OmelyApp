package com.syqu.shop.controller;

import com.syqu.shop.domain.CartItem;
import com.syqu.shop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Controller
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping(value = {"/cart","/shopping-cart"})
    public String viewCart(Model model) {
        String username = getCurrentUsername();
        List<CartItem> cartItems = cartService.getCartItemsByUsername(username);
        model.addAttribute("products", cartItems);
        model.addAttribute("totalPrice", calculateTotalPrice(cartItems));
        return "shopping-cart";
    }

    @PostMapping("/cart/add")
    public String addToCart(@RequestParam("productId") long productId, @RequestParam("quantity") int quantity) {
        String username = getCurrentUsername();
        cartService.addToCart(username, productId, quantity);
        return "redirect:/cart";
    }

    @GetMapping("/cart/add/{productId}")
    public String addToCartByPath(@PathVariable("productId") long productId, @RequestParam(defaultValue = "1") int quantity) {
        String username = getCurrentUsername();
        cartService.addToCart(username, productId, quantity);
        return "redirect:/cart";
    }

    @GetMapping("/cart/remove/{id}")
    public String removeFromCart(@PathVariable("id") long productId) {
        String username = getCurrentUsername();
        cartService.removeFromCart(username, productId);
        return "redirect:/cart";
    }

    @GetMapping("/cart/clear")
    public String clearCart() {
        String username = getCurrentUsername();
        cartService.clearCart(username);
        return "redirect:/cart";
    }

    @GetMapping("/cart/checkout")
    public String checkout() {
        // Handle checkout logic
        return "checkout";
    }

    @PostMapping("/cart/update")
    public String updateCart(@RequestParam("productId") long productId, @RequestParam("quantity") int quantity) {
        String username = getCurrentUsername();
        cartService.updateCart(username, productId, quantity ,0);
        return "redirect:/cart";
    }

    @PostMapping("/cart/update-cart")
    public ResponseEntity<?> updateCart(@RequestBody List<CartItem> cartItems) {
        try {
            String username = getCurrentUsername();
            for (CartItem cartItem : cartItems ){
                Long productID = cartItem.getId();
                int quantity = cartItem.getQuantity();
                int selectItem = cartItem.getSelectItem(); // Update the selectItem state
                cartService.updateCart(username, productID, quantity ,selectItem);
            }
            return ResponseEntity.ok().body("{\"message\": \"Cart updated successfully.\"}"); // Return a success message as JSON
        } catch (Exception e) {
            // Handle exceptions appropriately
            return ResponseEntity.status(500).body("{\"error\": \"Failed to update the cart.\"}"); // Return error message as JSON
        }
    }

    @PostMapping("/cart/updateQuantity")
    @ResponseBody
    public String updateQuantity(@RequestParam(value = "productId", required = false) Long productId,
                                 @RequestParam(value = "quantity", required = false) Integer quantity) {
        if (productId == null || quantity == null) {
            return "Error updating quantity. Required parameters are missing.";
        }

        String username = getCurrentUsername();
        cartService.updateCart(username, productId, quantity ,0);
        return "Quantity updated successfully.";
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null; // Or handle anonymous users as needed
    }

    private double calculateTotalPrice(List<CartItem> cartItems) {
        return cartItems.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();
    }
}
