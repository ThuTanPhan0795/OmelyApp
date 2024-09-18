package com.syqu.shop.service.impl;

import com.syqu.shop.domain.Product;
import com.syqu.shop.repository.ProductRepository;
import com.syqu.shop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

import javax.transaction.Transactional;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void save(Product product) {
        productRepository.save(product);
    }

    @Override
    public void edit(long id, Product newProduct) {
        Optional<Product> foundOpt = productRepository.findById(id);
        if (foundOpt.isPresent()) {
            Product found = foundOpt.get();
            found.setName(newProduct.getName());
            found.setImageUrl(newProduct.getImageUrl());
            found.setDescription(newProduct.getDescription());
            found.setPrice(newProduct.getPrice());
            productRepository.save(found);
        }
    }

    @Override
    public void delete(long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            productRepository.deleteById(id);
        }
    }

    @Override
    public Product findById(long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    public Page<Product> findAllByCategoryId(long categoryId, Pageable pageable) {
        return productRepository.findByCategoryId(categoryId, pageable);
    }
    @Override
    public Page<Product> findByNameContaining(String name, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(name, pageable); // Use case-insensitive search
    }

    @Override
    public long count() {
        return productRepository.count();
    }
}
