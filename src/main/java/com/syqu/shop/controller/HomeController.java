package com.syqu.shop.controller;

import com.syqu.shop.domain.Product;
import com.syqu.shop.service.CategoryService;
import com.syqu.shop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HomeController {
    private final ProductService productService;
    private final CategoryService categoryService;

    @Autowired
    public HomeController(ProductService productService, CategoryService categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }

    @GetMapping(value = {"/", "/index", "/home"})
    public String home(@RequestParam(defaultValue = "0") int page, Model model) {
        Pageable pageable = PageRequest.of(page, 12); // 3 products per page
        Page<Product> productsPage = productService.findAll(pageable);
        model.addAttribute("products", productsPage.getContent());
        model.addAttribute("productsCount", productService.count());
        model.addAttribute("categories", categoryService.findAll());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", productsPage.getTotalPages());
        return "home";
    }

    @RequestMapping("/searchByCategory")
    public String homePost(@RequestParam("categoryId") long categoryId, @RequestParam(defaultValue = "0") int page, Model model) {
        Pageable pageable = PageRequest.of(page, 12); // 3 products per page
        Page<Product> productsPage = productService.findAllByCategoryId(categoryId, pageable);
        model.addAttribute("products", productsPage.getContent());
        model.addAttribute("productsCount", productsPage.getTotalElements());
        model.addAttribute("categories", categoryService.findAll());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", productsPage.getTotalPages());
        return "home";
    }

    @GetMapping("/about")
    public String about() {
        return "about";
    }
}
