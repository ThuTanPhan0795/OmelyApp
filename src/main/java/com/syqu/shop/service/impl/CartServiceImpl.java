package com.syqu.shop.service.impl;

import com.syqu.shop.domain.CartItem;
import com.syqu.shop.domain.Product;
import com.syqu.shop.repository.CartItemRepository;
import com.syqu.shop.repository.ProductRepository; // Ensure this is imported
import com.syqu.shop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository; // Ensure this is declared

    @Autowired
    public CartServiceImpl(CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void addToCart(String username, long productId, int quantity) {
        CartItem cartItem = cartItemRepository.findByUsernameAndProductId(username, productId);
        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            Product product = productRepository.findById(productId).orElseThrow();
            cartItem = new CartItem();
            cartItem.setUsername(username);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
        }
        cartItemRepository.save(cartItem);
    }

    @Override
    public void removeFromCart(String username, long productId) {
        CartItem cartItem = cartItemRepository.findByUsernameAndProductId(username, productId);
        if (cartItem != null) {
            cartItemRepository.delete(cartItem);
        }
    }

    @Override
    public List<CartItem> getCartItemsByUsername(String username) {
        return cartItemRepository.findByUsername(username);
    }

    @Override
    public void updateCart(String username, long productId, int quantity ,int selectItem) {
        CartItem cartItem = cartItemRepository.findByUsernameAndProductId(username, productId);
        if (cartItem != null) {
            cartItem.setQuantity(quantity);
            cartItem.setSelectItem(selectItem);
            cartItemRepository.save(cartItem);
        }
    }

    @Override
    public void clearCart(String username) {
        List<CartItem> cartItems = cartItemRepository.findByUsername(username);
        cartItemRepository.deleteAll(cartItems);
    }
    @Override
    public List<CartItem> getSelectedItemsForUser(String username ) {
        return cartItemRepository.findByUsernameAndSelectItem(username, 1);
    }
}
