package com.syqu.shop.repository;

import com.syqu.shop.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findById(long id);
    Optional<Product> findByName(String name);
    Page<Product> findAll(Pageable pageable);
    Page<Product> findByCategoryId(long categoryId, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable); // Add this method
}
