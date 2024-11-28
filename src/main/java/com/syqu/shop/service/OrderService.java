package com.syqu.shop.service;

import java.util.List;

import com.syqu.shop.domain.OrderData;

public interface OrderService {
    void save(OrderData orderData);
    List<OrderData> getOrderDataByUsername(String username);
    OrderData findById(long orderId);
    void deleteById(Long orderId);
    List<OrderData> getAllOrders();
}
