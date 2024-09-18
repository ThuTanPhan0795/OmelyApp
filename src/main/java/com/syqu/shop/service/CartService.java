package com.syqu.shop.service;

import com.syqu.shop.domain.CartItem;
import java.util.List;

public interface CartService {
    void addToCart(String username, long productId, int quantity);
    void removeFromCart(String username, long productId);
    List<CartItem> getCartItemsByUsername(String username);
    void updateCart(String username, long productId, int quantity);
    void clearCart(String username);
}
