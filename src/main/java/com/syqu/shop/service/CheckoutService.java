package com.syqu.shop.service;

import java.util.List;
import java.util.Optional;

import com.syqu.shop.domain.CheckoutUserInfor;

public interface CheckoutService {
    CheckoutUserInfor saveUserInfo(CheckoutUserInfor userInfo);
    List<CheckoutUserInfor> getUserInfoByUsername(String username);
    void deleteUserInfoByUsernameAndId(String username, Long id);
    // New method to update user info by username and id
    CheckoutUserInfor updateUserInfoByUsernameAndId(String username, Long id, CheckoutUserInfor updatedInfo);
}
