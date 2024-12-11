package com.syqu.shop.controller;

import com.syqu.shop.domain.CartItem;
import com.syqu.shop.domain.Product;
import com.syqu.shop.service.ProductService;
import com.syqu.shop.service.CartService;
import com.syqu.shop.service.CategoryService;
import com.syqu.shop.validator.ProductValidator;

import java.math.BigDecimal;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.data.domain.Sort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class ProductController {
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    private final ProductService productService;
    private final ProductValidator productValidator;
    private final CategoryService categoryService;
    private final CartService cartService;

    @Autowired
    public ProductController(ProductService productService, ProductValidator productValidator, CategoryService categoryService , CartService cartService) {
        this.productService = productService;
        this.productValidator = productValidator;
        this.categoryService = categoryService;
        this.cartService = cartService;
    }

    @GetMapping("/product/new")
    public String newProduct(Model model) {
        model.addAttribute("productForm", new Product());
        model.addAttribute("method", "new");
        model.addAttribute("categories", categoryService.findAll());
        return "product";
    }

    @PostMapping("/product/new")
    public String newProduct(@ModelAttribute("productForm") Product productForm, BindingResult bindingResult, Model model) {
        productValidator.validate(productForm, bindingResult);

        if (bindingResult.hasErrors()) {
            logger.error("Validation errors: {}", bindingResult.getAllErrors());
            model.addAttribute("method", "new");
            model.addAttribute("categories", categoryService.findAll());
            return "product";
        }
        productService.save(productForm);
        logger.debug("Product with id: {} successfully created.", productForm.getId());

        return "redirect:/home";
    }

    @GetMapping("/product/edit/{id}")
    public String editProduct(@PathVariable("id") long productId, Model model) {
        Product product = productService.findById(productId);
        if (product != null) {
            model.addAttribute("productForm", product);
            model.addAttribute("method", "edit");
            model.addAttribute("categories", categoryService.findAll());
            return "product";
        } else {
            model.addAttribute("errorMessage", "Product not found.");
            return "error/404";
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/product/edit/{id}")
    public String editProduct(@PathVariable("id") long productId, @ModelAttribute("productForm") Product productForm, BindingResult bindingResult, Model model) {
        productValidator.validate(productForm, bindingResult);

        if (bindingResult.hasErrors()) {
            logger.error("Validation errors: {}", bindingResult.getAllErrors());
            model.addAttribute("method", "edit");
            model.addAttribute("categories", categoryService.findAll());
            return "product";
        }
        productService.edit(productId, productForm);
        logger.debug("Product with id: {} has been successfully edited.", productId);

        return "redirect:/home";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/product/delete/{id}")
    public String deleteProduct(@PathVariable("id") long productId) {

        cartService.removeFromCartByProductId(productId);

        Product product = productService.findById(productId);
        if (product != null) {
            productService.delete(productId);
            logger.debug("Product with id: {} successfully deleted.", product.getId());
            return "redirect:/home";
        } else {
            return "error/404";
        }
    }

    @GetMapping("/products")
    public String listProducts(@PageableDefault(size = 12) Pageable pageable, Model model) {
        Page<Product> productPage = productService.findAll(pageable);
        model.addAttribute("products", productPage.getContent());
        model.addAttribute("productsPage", productPage);
        return "products";
    }

    @GetMapping("/searchByCategory/{categoryId}")
    public String searchByCategory(@PathVariable("categoryId") long categoryId, @PageableDefault(size = 12) Pageable pageable, Model model) {
        Page<Product> productPage = productService.findAllByCategoryId(categoryId, pageable);
        model.addAttribute("products", productPage.getContent());
        model.addAttribute("productsPage", productPage);
        return "products";
    }

    @GetMapping("/searchByProductName")
    public String searchByProductName(@RequestParam("query") String query, @RequestParam(defaultValue = "0") int page, Model model) {
        Pageable pageable = PageRequest.of(page, 12); // 12 products per page
        Page<Product> productsPage = productService.findByNameContaining(query, pageable);
        model.addAttribute("products", productsPage.getContent());
        model.addAttribute("productsCount", productsPage.getTotalElements());
        model.addAttribute("categories", categoryService.findAll());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", productsPage.getTotalPages());
        return "shop";
    }
    
    @GetMapping("/shop")
    public String getFilteredProducts(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "newest") String sortBy,
                                  Model model) {
        Pageable pageable = PageRequest.of(page, 12, determineSort(sortBy));
        // update findAll function for sorting categories minPrice maxPrice
        Page<Product> productsPage = productService.findAll(pageable);

        model.addAttribute("products", productsPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", productsPage.getTotalPages());
        model.addAttribute("productsCount", productsPage.getTotalElements());
        model.addAttribute("categories", categoryService.findAll());
        return "shop";
    }

    private Sort determineSort(String sortBy) {
        if ("priceAsc".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "price");
        } else if ("priceDesc".equals(sortBy)) {
            return Sort.by(Sort.Direction.DESC, "price");
        } else if ("newest".equals(sortBy)) {
            return Sort.by(Sort.Direction.DESC, "id");
        } else if ("oldest".equals(sortBy)) {
            return Sort.by(Sort.Direction.ASC, "id");
        }
        return Sort.unsorted();
    }

    @GetMapping("/shop_filter")
    public String filterShop(
                            @RequestParam(defaultValue = "0") int page,                // Page number
                            @RequestParam(defaultValue = "newest") String sortBy,      // Sorting option
                            @RequestParam(required = false) Integer categories,        // Category ID (nullable)
                            @RequestParam(required = false) BigDecimal minPrice,          // Minimum price (nullable)
                            @RequestParam(required = false) BigDecimal maxPrice,          // Maximum price (nullable)
                            Model model,
                            HttpServletRequest request) {   
        Page<Product> productsPage = productService.getFilteredProducts(page,sortBy,categories,minPrice,maxPrice);
        model.addAttribute("products", productsPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", productsPage.getTotalPages());
        model.addAttribute("productsCount", productsPage.getTotalElements());
        model.addAttribute("sortBy", sortBy);

        String requestedWith = request.getHeader("X-Requested-With");
        if ("XMLHttpRequest".equals(requestedWith)) {
            return "fragments/product-list :: product-list";
        }
        model.addAttribute("categories", categoryService.findAll());
        return "shop";
    }

}
