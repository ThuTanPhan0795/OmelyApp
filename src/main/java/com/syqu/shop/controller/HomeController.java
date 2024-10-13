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

    @GetMapping(value = {"/","/home"})
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
    @GetMapping(value = {"/", "/index"})
    public String index(@RequestParam(defaultValue = "0") int page, Model model) {
        return "index";
    }
    @GetMapping(value = {"/contact.html"})
    public String contact(@RequestParam(defaultValue = "0") int page, Model model) {
        return "contact";
    }
    @GetMapping(value = {"/shop.html"})
    public String shop(@RequestParam(defaultValue = "0") int page, Model model) {
        Pageable pageable = PageRequest.of(page, 12); // 3 products per page
        Page<Product> productsPage = productService.findAll(pageable);
        model.addAttribute("products", productsPage.getContent());
        // model.addAttribute("productsCount", productService.count());
        // model.addAttribute("categories", categoryService.findAll());
        // model.addAttribute("currentPage", page);
        // model.addAttribute("totalPages", productsPage.getTotalPages());
        // return "home";
        return "shop";
    }
    @GetMapping(value = {"/shopping-cart.html"})
    public String shoppingcart(@RequestParam(defaultValue = "0") int page, Model model) {
        return "shopping-cart";
    }
    @GetMapping(value = {"/check-out.html"})
    public String checkout(@RequestParam(defaultValue = "0") int page, Model model) {
        return "check-out";
    }
    @GetMapping(value = {"/register.html"})
    public String register(@RequestParam(defaultValue = "0") int page, Model model) {
        return "register";
    }
    @GetMapping(value = {"/login.html"})
    public String login(@RequestParam(defaultValue = "0") int page, Model model) {
        return "login";
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
