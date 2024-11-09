package com.syqu.shop.domain;

import javax.persistence.*;

@Entity
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @ManyToOne(cascade = CascadeType.PERSIST)  // Don't use REMOVE. Only use persist, or no cascade.
    @JoinColumn(name = "product_id", nullable = false) // Specify the foreign key column name
    private Product product;

    private int quantity;

    private int selectItem;

    public CartItem() {
    }

    public CartItem(String username, Product product, int quantity) {
        this.username = username;
        this.product = product;
        this.quantity = quantity;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getSelectItem() {
        return selectItem;
    }

    public void setSelectItem(int selectItem) {
        this.selectItem = selectItem;
    }
}
