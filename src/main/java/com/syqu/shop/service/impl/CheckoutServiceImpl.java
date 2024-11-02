package com.syqu.shop.service.impl;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.syqu.shop.domain.CheckoutUserInfor;
import com.syqu.shop.repository.CheckoutRepository;
import com.syqu.shop.service.CheckoutService;

import java.util.List;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private final CheckoutRepository checkoutRepository;

    @Autowired
    public CheckoutServiceImpl(CheckoutRepository checkoutRepository) {
        this.checkoutRepository = checkoutRepository;
    }

    @Override
    public CheckoutUserInfor saveUserInfo(CheckoutUserInfor userInfo) {
        return checkoutRepository.save(userInfo);
    }

    @Override
    public List<CheckoutUserInfor> getUserInfoByUsername(String username) {
        return checkoutRepository.findByUsername(username); // Retrieve user info by username
    }

    @Override
    public void deleteUserInfoByUsernameAndId(String username, Long id) {
        checkoutRepository.deleteByUsernameAndId(username, id); // Delete user info by username and ID
    }
    @Override
    public CheckoutUserInfor updateUserInfoByUsernameAndId(String username, Long id, CheckoutUserInfor updatedInfo) {
        // Find the existing user
        Optional<CheckoutUserInfor> existingUser = checkoutRepository.findByUsernameAndId(username, id);
        if (existingUser.isPresent()) {
            CheckoutUserInfor userToUpdate = existingUser.get();
            // Update fields
            userToUpdate.setFirstName(updatedInfo.getFirstName());
            userToUpdate.setLastName(updatedInfo.getLastName());
            userToUpdate.setEmail(updatedInfo.getEmail());
            userToUpdate.setMobileNo(updatedInfo.getMobileNo());
            userToUpdate.setAddress(updatedInfo.getAddress());
            userToUpdate.setDistrict(updatedInfo.getDistrict());
            userToUpdate.setCountry(updatedInfo.getCountry());
            userToUpdate.setCity(updatedInfo.getCity());
            userToUpdate.setZipCode(updatedInfo.getZipCode());
            userToUpdate.setUsername(updatedInfo.getUsername()); // Optional, if you allow username changes

            return checkoutRepository.save(userToUpdate); // Save updated user info
        } else {
            throw new RuntimeException("User not found"); // Handle user not found case
        }
    }
}
