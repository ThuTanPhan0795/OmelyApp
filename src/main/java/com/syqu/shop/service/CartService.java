package com.syqu.shop.service;

import com.syqu.shop.domain.CartItem;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CartService {
    void addToCart(String username, long productId, int quantity);
    void removeFromCart(String username, long productId);
    void updateCart(String username, long productId, int quantity ,int selectItem);
    void clearCart(String username);
    List<CartItem> getCartItemsByUsername(String username);
    List<CartItem> getSelectedItemsForUser(String username);
    void removeFromCartByProductId(long productId);
}
