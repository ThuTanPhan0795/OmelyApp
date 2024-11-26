package com.syqu.shop.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.syqu.shop.domain.OrderData;

@Repository
public interface OrderRepository extends JpaRepository<OrderData, Long> {
    List<OrderData> findByUsernameOrderByIdDesc(String username);
}
