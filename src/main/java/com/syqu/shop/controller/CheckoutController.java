package com.syqu.shop.controller;
import com.syqu.shop.domain.CartItem;
import com.syqu.shop.domain.CheckoutUserInfor;
import com.syqu.shop.domain.OrderData;
import com.syqu.shop.domain.OrderRequestDTO;
import com.syqu.shop.domain.OrderStatus;
import com.syqu.shop.domain.Product;
import com.syqu.shop.domain.User;
import com.syqu.shop.service.CheckoutService;
import com.syqu.shop.service.OrderService;
import com.syqu.shop.service.ProductService;
import com.syqu.shop.service.UserService;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class CheckoutController {

    private final CheckoutService checkoutService;
    private final OrderService orderService;
    private final  ProductService productService;
    private final  UserService userService;
    

    @Autowired
    public CheckoutController(CheckoutService checkoutService ,OrderService orderService ,
                               ProductService productService, UserService userService) {
        this.checkoutService = checkoutService;
        this.orderService = orderService;
        this.productService = productService;
        this.userService = userService;

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

        orderData.setOrderStatus(OrderStatus.WAITING_FOR_CONFIRMATION);
        
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
    @GetMapping("/order")
    public String getOrderDetails(Model model) {
        String username = getCurrentUsername(); // Get the current username
            // Check if the user is authenticated
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || isAnonymousUser(authentication)) {
            // Redirect to login if the user is not logged in
            return "redirect:/login";
        }
        List<OrderData> orders = orderService.getOrderDataByUsername(username);
        List<List<CartItem>> orderCartItems = new ArrayList<>(); // List to store CartItems
        
        // Pass the orders to the model
        model.addAttribute("orders", orders);
        
        // Loop through the orders
        for (OrderData order : orders) {
            List<CartItem> cartItems = new ArrayList<>();
            String listProductId = order.getListProductId();  // Get product IDs as a string
            String listProductQuantity = order.getListProductQuantity();  
            
            // Split the string of product IDs (e.g., "6-7-8") into an array
            String[] productIdArray = listProductId.split("-");
            String[] productQuantityArray = listProductQuantity.split("-");
            
            // Convert the string array to a List<Long> of product IDs and map quantities
            for (int i = 0; i < productIdArray.length; i++) {
                try {
                    Long productID = Long.parseLong(productIdArray[i].trim()); // Convert string to Long
                    Product product = productService.findById(productID); // Fetch the product by ID
                    if (product != null) {
                        // Get the corresponding quantity for this product
                        int quantity = i < productQuantityArray.length ? Integer.parseInt(productQuantityArray[i].trim()) : 0;
                        CartItem cartItem = new CartItem();
                        cartItem.setProduct(product); // Set the product
                        cartItem.setQuantity(quantity); // Set the quantity
                        cartItems.add(cartItem); // Add the cart item to the list
                    }
                } catch (NumberFormatException e) {
                    // Handle any errors in case the product ID or quantity cannot be parsed
                    e.printStackTrace();
                }
            }
            orderCartItems.add(cartItems);
        }
        
        // Add the list of cart items to the model
        model.addAttribute("orderCartItems", orderCartItems);
        
        return "order"; // Return the view name
    }
    @PostMapping("/cancel-order")
    public ResponseEntity<?> cancelOrder(@RequestBody Map<String, Long> request) {
        Long orderId = request.get("id");
        try {
            OrderData order = orderService.findById(orderId);
            if (order != null && order.getOrderStatus() == 1) {
                order.setOrderStatus(6); // Set status to "Cancelled"
                orderService.save(order);
                return ResponseEntity.ok("Order cancelled successfully.");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Order cannot be cancelled.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error cancelling the order.");
        }
    }
    
    @PostMapping("/delete-order")
    public ResponseEntity<?> deleteOrder(@RequestBody Map<String, Long> request) {
        Long orderId = request.get("id");
        try {
            orderService.deleteById(orderId); // Delete the order from the database
            return ResponseEntity.ok("Order deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting the order.");
        }
    }

    @GetMapping("/order-manager")
    public String getAllOrder(Model model) {
        if (!isAdmin()) {
            // If the user is not an admin, return an error message to the page
            model.addAttribute("errorMessage", "You don't have permission to see this page.");
            return "error"; // Return to an error page (create an error.html page)
        }
        List<OrderData> orders = orderService.getAllOrders();
        List<List<CartItem>> orderCartItems = new ArrayList<>(); // List to store CartItems
        
        // Pass the orders to the model
        model.addAttribute("orders", orders);
        
        // Loop through the orders
        for (OrderData order : orders) {
            List<CartItem> cartItems = new ArrayList<>();
            String listProductId = order.getListProductId();  // Get product IDs as a string
            String listProductQuantity = order.getListProductQuantity();  
            
            // Split the string of product IDs (e.g., "6-7-8") into an array
            String[] productIdArray = listProductId.split("-");
            String[] productQuantityArray = listProductQuantity.split("-");
            
            // Convert the string array to a List<Long> of product IDs and map quantities
            for (int i = 0; i < productIdArray.length; i++) {
                try {
                    Long productID = Long.parseLong(productIdArray[i].trim()); // Convert string to Long
                    Product product = productService.findById(productID); // Fetch the product by ID
                    if (product != null) {
                        // Get the corresponding quantity for this product
                        int quantity = i < productQuantityArray.length ? Integer.parseInt(productQuantityArray[i].trim()) : 0;
                        CartItem cartItem = new CartItem();
                        cartItem.setProduct(product); // Set the product
                        cartItem.setQuantity(quantity); // Set the quantity
                        cartItems.add(cartItem); // Add the cart item to the list
                    }
                } catch (NumberFormatException e) {
                    // Handle any errors in case the product ID or quantity cannot be parsed
                    e.printStackTrace();
                }
            }
            orderCartItems.add(cartItems);
        }
        
        // Add the list of cart items to the model
        model.addAttribute("orderCartItems", orderCartItems);
        
        return "order-manager"; // Return the view name
    }

    private boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }
        return false;
    }

    private boolean isAnonymousUser(Authentication authentication) {
        return authentication.getPrincipal().equals("anonymousUser");
    }

    @PostMapping("/update-order-status/{orderId}/{status}")
    @ResponseBody
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long orderId, @PathVariable int status) {
        // Ensure the user has admin privileges
        if (!isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }

        // Find the order and update the status
        OrderData order = orderService.findById(orderId);
        if (order != null) {
            order.setOrderStatus(status); // Update the order status
            orderService.save(order);    // Save the updated order
            return ResponseEntity.ok("Status updated");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }
    }

}
