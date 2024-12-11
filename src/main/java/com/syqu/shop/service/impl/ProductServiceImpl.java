package com.syqu.shop.service.impl;

import com.syqu.shop.domain.Product;
import com.syqu.shop.repository.ProductRepository;
import com.syqu.shop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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
        return productRepository.findByCategoryIdOrderByIdDesc(categoryId, pageable);
    }
    @Override
    public Page<Product> findByNameContaining(String name, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCaseOrderByIdDesc(name, pageable); // Use case-insensitive search
    }

    @Override
    public long count() {
        return productRepository.count();
    }

    @Override
    public Page<Product> getFilteredProducts(int page, String sortBy, Integer categories, BigDecimal minPrice, BigDecimal maxPrice) {
        // Create Sort object based on sortBy parameter
        Sort sort;

        switch (sortBy) {
            case "priceAsc":
                sort = Sort.by("price").ascending();
                break;
            case "priceDesc":
                sort = Sort.by("price").descending();
                break;
            case "newest":
                sort = Sort.by("createdAt").descending();
                break;
            case "oldest":
                sort = Sort.by("createdAt").ascending();
                break;
            default:
                sort = Sort.unsorted();
        }

        // Create Pageable object
        PageRequest pageable = PageRequest.of(page, 12, sort); // Assuming 12 items per page

        // Call repository method
        return productRepository.findFilteredProducts(categories, minPrice, maxPrice, pageable);
    }
    

    // @Override
    // public Page<Product> findAllSorted(String sortBy, Pageable pageable) {
    //     switch (sortBy) {
    //         case "priceAsc":
    //             return productRepository.findAllByOrderByPriceAsc(pageable);
    //         case "priceDesc":
    //             return productRepository.findAllByOrderByPriceDesc(pageable);
    //         case "newest":
    //             return productRepository.findAllByOrderByIdDesc(pageable);
    //         case "oldest":
    //             return productRepository.findAllByOrderByIdAsc(pageable);
    //         default:
    //             return productRepository.findAll(pageable);
    //     }
    // }
}
