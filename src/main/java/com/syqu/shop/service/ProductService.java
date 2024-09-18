package com.syqu.shop.service;

import com.syqu.shop.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    void save(Product product);
    void edit(long id, Product newProduct);
    void delete(long id);
    Product findById(long id);
    Page<Product> findAll(Pageable pageable);
    Page<Product> findAllByCategoryId(long categoryId, Pageable pageable);
    Page<Product> findByNameContaining(String name, Pageable pageable); // Add this method
    long count();
}
