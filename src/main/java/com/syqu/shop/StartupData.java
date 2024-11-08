package com.syqu.shop;

import com.syqu.shop.domain.Category;
import com.syqu.shop.domain.Product;
import com.syqu.shop.repository.CategoryRepository;
import com.syqu.shop.service.ProductService;
import com.syqu.shop.domain.User;
import com.syqu.shop.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class StartupData implements CommandLineRunner {
    private final UserService userService;
    private final ProductService productService;
    private final CategoryRepository categoryRepository;
    private static final Logger logger = LoggerFactory.getLogger(StartupData.class);

    @Autowired
    public StartupData(UserService userService, ProductService productService, CategoryRepository categoryRepository) {
        this.userService = userService;
        this.productService = productService;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        // adminAccount();
        // userAccount();
        // category();
        // for (int i = 0 ; i<= 100 ; i++){
        //     exampleProducts(i+10);   
        // }
    }

    private void userAccount(){
        User user = new User();

        user.setUsername("user");
        user.setPassword("user");
        user.setPasswordConfirm("user");
        user.setGender("Female");
        user.setEmail("user@example.com");

        userService.save(user);
    }

    private void adminAccount(){
        User admin = new User();

        admin.setUsername("admin");
        admin.setPassword("admin");
        admin.setPasswordConfirm("admin");
        admin.setGender("Male");
        admin.setEmail("admin@example.com");

        userService.save(admin);
    }

    private void category(){
        Category category1 = new Category();
        Category category2 = new Category();
        Category category3 = new Category();
        category1.setId(11);
        category1.setCategoryName("Men's");
        category2.setId(12);
        category2.setCategoryName("Women's");
        category3.setId(13);
        category3.setCategoryName("Kid's");

        categoryRepository.save(category1);
        categoryRepository.save(category2);
        categoryRepository.save(category3);
    }

    private void exampleProducts(int price){
        final String NAME = "Powerful Blender";
        final String IMAGE_URL = "https://raw.githubusercontent.com/ThuTanPhan0795/OmelyApp/refs/heads/fashi/src/main/resources/static/img/products/product-2.jpg";
        final String DESCRIPTION = "A powerful blender for smoothies and shakes.";
        final BigDecimal PRICE = BigDecimal.valueOf(price);

        Product product1 = new Product();
        Product product2 = new Product();
        Product product3 = new Product();
        Product product4 = new Product();
        Product product5 = new Product();
        Product product6 = new Product();
        Product product7 = new Product();
        Product product8 = new Product();
        Product product9 = new Product();
        Product product10 = new Product();

        product1.setName(NAME);
        product1.setImageUrl(IMAGE_URL);
        product1.setDescription(DESCRIPTION);
        product1.setCategory(categoryRepository.findByCategoryName("Women's"));
        product1.setPrice(PRICE);

        product2.setName(NAME);
        product2.setImageUrl(IMAGE_URL);
        product2.setDescription(DESCRIPTION);
        product2.setCategory(categoryRepository.findByCategoryName("Men's"));
        product2.setPrice(PRICE);

        product3.setName(NAME);
        product3.setImageUrl(IMAGE_URL);
        product3.setDescription(DESCRIPTION);
        product3.setCategory(categoryRepository.findByCategoryName("Kid's"));
        product3.setPrice(PRICE);

        product4.setName(NAME);
        product4.setImageUrl(IMAGE_URL);
        product4.setDescription(DESCRIPTION);
        product4.setCategory(categoryRepository.findByCategoryName("Women's"));
        product4.setPrice(PRICE);

        product5.setName(NAME);
        product5.setImageUrl(IMAGE_URL);
        product5.setDescription(DESCRIPTION);
        product5.setCategory(categoryRepository.findByCategoryName("Men's"));
        product5.setPrice(PRICE);

        product6.setName(NAME);
        product6.setImageUrl(IMAGE_URL);
        product6.setDescription(DESCRIPTION);
        product6.setCategory(categoryRepository.findByCategoryName("Kid's"));
        product6.setPrice(PRICE);

        product7.setName(NAME);
        product7.setImageUrl(IMAGE_URL);
        product7.setDescription(DESCRIPTION);
        product7.setCategory(categoryRepository.findByCategoryName("Women's"));
        product7.setPrice(PRICE);

        product8.setName(NAME);
        product8.setImageUrl(IMAGE_URL);
        product8.setDescription(DESCRIPTION);
        product8.setCategory(categoryRepository.findByCategoryName("Men's"));
        product8.setPrice(PRICE);

        product9.setName(NAME);
        product9.setImageUrl(IMAGE_URL);
        product9.setDescription(DESCRIPTION);
        product9.setCategory(categoryRepository.findByCategoryName("Kid's"));
        product9.setPrice(PRICE);

        product10.setName(NAME);
        product10.setImageUrl(IMAGE_URL);
        product10.setDescription(DESCRIPTION);
        product10.setCategory(categoryRepository.findByCategoryName("Women's"));
        product10.setPrice(PRICE);

        productService.save(product1);
        productService.save(product2);
        productService.save(product3);
        productService.save(product4);
        productService.save(product5);
        productService.save(product6);
        productService.save(product7);
        productService.save(product8);
        productService.save(product9);
        productService.save(product10);
    }
}
