package com.syqu.shop.repository;

import com.syqu.shop.domain.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    CartItem findByUsernameAndProductId(String username, long productId);
    List<CartItem> findByUsername(String username);
    List<CartItem> findByUsernameAndSelectItem(String username, int selectItem);
    void removeByProductId(long productId);
}
