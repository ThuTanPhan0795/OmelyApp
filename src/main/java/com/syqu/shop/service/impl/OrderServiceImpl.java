package com.syqu.shop.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.syqu.shop.domain.OrderData;
import com.syqu.shop.repository.OrderRepository;
import com.syqu.shop.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository oderRepository;

    @Autowired
    public OrderServiceImpl(OrderRepository oderRepository) {
        this.oderRepository = oderRepository;
    }

    @Override
    public void save(OrderData orderData) {
        // TODO Auto-generated method stub
        oderRepository.save(orderData);
    }

    @Override
    public List<OrderData> getOrderDataByUsername(String username) {
        // TODO Auto-generated method stub
        return oderRepository.findByUsernameOrderByIdDesc(username);
    }
    
}
