package com.syqu.shop.controller;

import com.syqu.shop.domain.Product;
import com.syqu.shop.service.CategoryService;
import com.syqu.shop.service.ProductService;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
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

    // @GetMapping(value = {"/home"})
    // public String home(@RequestParam(defaultValue = "0") int page, Model model) {
    //     Pageable pageable = PageRequest.of(page, 12); // 3 products per page
    //     Page<Product> productsPage = productService.findAll(pageable);
    //     model.addAttribute("products", productsPage.getContent());
    //     model.addAttribute("productsCount", productService.count());
    //     model.addAttribute("categories", categoryService.findAll());
    //     model.addAttribute("currentPage", page);
    //     model.addAttribute("totalPages", productsPage.getTotalPages());
    //     return "home";
    // }
    @GetMapping(value = {"/", "/index","/home"})
    public String index(@RequestParam(defaultValue = "0") int page, Model model) {
        return "index";
    }
    @GetMapping(value = {"/contact"})
    public String contact(@RequestParam(defaultValue = "0") int page, Model model) {
        return "contact";
    }

    @CrossOrigin(origins = "*") // Allow all origins or specify the allowed origin
    @GetMapping(value = "/shop")
    public String shop(@RequestParam(defaultValue = "0") int page,
                    @RequestParam(defaultValue = "default") String sortBy,
                    Model model,
                    HttpServletRequest request) {
        Pageable pageable = PageRequest.of(page, 12, determineSort(sortBy));
        Page<Product> productsPage = productService.findAll(pageable);

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

    // @GetMapping(value = {"/check-out"})
    // public String checkout(@RequestParam(defaultValue = "0") int page, Model model) {
    //     return "check-out";
    // }
    // @GetMapping(value = {"/login"})
    // public String login(@RequestParam(defaultValue = "0") int page, Model model) {
    //     return "login";
    // }

    @RequestMapping("/searchByCategory")
    public String homePost(@RequestParam("categoryId") long categoryId, @RequestParam(defaultValue = "0") int page, Model model) {
        Pageable pageable = PageRequest.of(page, 12); // 3 products per page
        Page<Product> productsPage = productService.findAllByCategoryId(categoryId, pageable);
        model.addAttribute("products", productsPage.getContent());
        model.addAttribute("productsCount", productsPage.getTotalElements());
        model.addAttribute("categories", categoryService.findAll());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", productsPage.getTotalPages());
        return "shop";
    }

    @GetMapping("/about")
    public String about() {
        return "about";
    }

    @GetMapping("/blog")
    public String blog() {
        return "blog";
    }

    @GetMapping("/blog-details")
    public String blogdetails() {
        return "blog-details";
    }

    @GetMapping("/faq")
    public String faq() {
        return "faq";
    }
}
