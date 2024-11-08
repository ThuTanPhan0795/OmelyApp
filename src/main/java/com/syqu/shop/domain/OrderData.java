package com.syqu.shop.domain;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.util.Date;  // Add the Date import

@Data
@NoArgsConstructor // Generates a no-args constructor
@AllArgsConstructor // Generates a constructor with all fields
@Builder // Enables the Builder pattern
@Entity
@Table(name = "OrderData")
public class OrderData {
    @Column(name = "username", nullable = false)
    private String username;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    @NotNull
    private String firstName;

    @Column(name = "last_name", nullable = false)
    @NotNull
    private String lastName;

    @Column(name = "email", nullable = false)
    @Email
    @NotNull
    private String email;

    @Column(name = "mobile_no", nullable = false)
    @NotNull
    private String mobileNo;

    @Column(name = "address", nullable = false)
    @NotNull
    private String address;

    @Column(name = "district")
    private String district;

    @Column(name = "country", nullable = false)
    @NotNull
    private String country;

    @Column(name = "city", nullable = false)
    @NotNull
    private String city;

    @Column(name = "zip_code", nullable = false)
    @NotNull
    private String zipCode;

    @Column(name = "list_product_id", nullable = false)
    @NotNull
    private String listProductId;

    @Column(name = "list_product_quantity", nullable = false)
    @NotNull
    private String listProductQuantity;

    @Column(name = "total_price")
    @NotNull
    private BigDecimal totalPrice;

    // New orderDate field
    @Column(name = "order_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)  // Use @Temporal to map to a timestamp
    private Date orderDate;

    // Explicit getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNo() {
        return mobileNo;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }
    public String getListProductId() {
        return listProductId;
    }

    public void setListProductQuantity(String listProductQuantity) {
        this.listProductQuantity = listProductQuantity;
    }
    public String getListProductQuantity() {
        return listProductQuantity;
    }

    public void setListProductId(String listProductId) {
        this.listProductId = listProductId;
    }
    
    public BigDecimal getTotalPrice(){
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice){
        this.totalPrice = totalPrice;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }
}
