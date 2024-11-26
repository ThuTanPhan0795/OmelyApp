package com.syqu.shop.service;

import java.util.List;

import com.syqu.shop.domain.OrderData;

public interface OrderService {
    void save(OrderData orderData);
    List<OrderData> getOrderDataByUsername(String username);
}
