package com.syqu.shop.repository;

import com.syqu.shop.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findById(long id);
    Optional<Product> findByName(String name);

    Page<Product> findAll(Pageable pageable); // Ordered by ID decreasing
    Page<Product> findByCategoryIdOrderByIdDesc(long categoryId, Pageable pageable); // Ordered by ID decreasing for category
    Page<Product> findByNameContainingIgnoreCaseOrderByIdDesc(String name, Pageable pageable); // Ordered by ID decreasing for name search
    
    @Query("SELECT p FROM Product p WHERE "
               + "(:categories IS NULL OR p.category.id = :categories) AND "
               + "(:minPrice IS NULL OR p.price >= :minPrice) AND "
               + "(:maxPrice IS NULL OR p.price <= :maxPrice) AND "
               + "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))")
     Page<Product> findFilteredProducts(
          @Param("categories") Long categories,
          @Param("minPrice") BigDecimal minPrice,
          @Param("maxPrice") BigDecimal maxPrice,
          @Param("name") String name,
          Pageable pageable);

}
