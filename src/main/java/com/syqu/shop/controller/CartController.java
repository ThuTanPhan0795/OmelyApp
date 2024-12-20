package com.syqu.shop.controller;

import com.syqu.shop.domain.CartItem;
import com.syqu.shop.domain.CheckoutUserInfor;
import com.syqu.shop.service.CartService;
import com.syqu.shop.service.CheckoutService;

import javassist.bytecode.stackmap.BasicBlock.Catch;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

@Controller
public class CartController {

    private final CartService cartService;
    private final CheckoutService checkoutService;

    @Autowired
    public CartController(CartService cartService , CheckoutService checkoutService ) {
        this.cartService = cartService;
        this.checkoutService = checkoutService;
    }

    @GetMapping(value = {"/cart","/shopping-cart"})
    public String viewCart(Model model) {
         // Check if the user is authenticated
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || isAnonymousUser(authentication)) {
            // Redirect to login if the user is not logged in
            return "redirect:/login";
        }
        String username = getCurrentUsername();
        List<CartItem> cartItems = cartService.getCartItemsByUsername(username);
        model.addAttribute("products", cartItems);
        model.addAttribute("totalPrice", calculateTotalPrice(cartItems));
        return "shopping-cart";
    }

    private boolean isAnonymousUser(Authentication authentication) {
        return authentication.getPrincipal().equals("anonymousUser");
    }

    @PostMapping("/cart/add")
    public String addToCart(@RequestParam("productId") long productId, @RequestParam("quantity") int quantity) {
        String username = getCurrentUsername();
        cartService.addToCart(username, productId, quantity);
        return "redirect:/cart";
    }

    @GetMapping("/cart/add/{productId}")
    public ResponseEntity<Map<String, String>> addToCartByPath(@PathVariable("productId") long productId, @RequestParam(defaultValue = "1") int quantity) {
        String username = getCurrentUsername();
        Map<String, String> response = new HashMap<>();
        try {
          cartService.addToCart(username, productId, quantity);
          response.put("message", "Product added to cart successfully!");
          return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("message", "Product added to cart failed!");
        }
       return ResponseEntity.ok(response);
    }

    // @GetMapping("/cart/remove/{id}")
    // public String removeFromCart(@PathVariable("id") long productId) {
    //     String username = getCurrentUsername();
    //     cartService.removeFromCart(username, productId);
    //     return "redirect:/cart";
    // }
    @DeleteMapping("cart/remove/{productId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long productId) {
        try {
            String username = getCurrentUsername();
            cartService.removeFromCart(username, productId);
            return ResponseEntity.noContent().build(); // Return 204 No Content on success
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/cart/remove-all")
    @ResponseBody
    public ResponseEntity<String> removeAllItems(HttpSession session) {
        try {
            String username = getCurrentUsername(); // This should fetch the logged-in user's username
            cartService.clearCart(username); // Clear the user's cart
            return ResponseEntity.ok("{\"status\":\"success\",\"message\":\"All items removed successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("{\"status\":\"error\",\"message\":\"Failed to remove items\"}");
        }
    }


    // @GetMapping("/cart/clear")
    // public String clearCart() {
    //     String username = getCurrentUsername();
    //     cartService.clearCart(username);
    //     return "redirect:/cart";
    // }

    @GetMapping({"/check-out","/checkout"})
    public String checkout(Model model) {
        String userName = getCurrentUsername();  // Implement this method to retrieve the current user’s ID
        List<CartItem> selectedItems = cartService.getSelectedItemsForUser(userName);
        List<CheckoutUserInfor> checkoutUserInfors = checkoutService.getUserInfoByUsername(userName);
        
        model.addAttribute("selectedItems", selectedItems); // Pass selected items to the view
        model.addAttribute("checkoutUserInfors", checkoutUserInfors); // Pass selected items to the view
        return "check-out";
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
