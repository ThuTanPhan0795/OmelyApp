package com.syqu.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.syqu.shop.domain.CheckoutUserInfor;

import java.util.List;
import java.util.Optional;

@Repository
public interface CheckoutRepository extends JpaRepository<CheckoutUserInfor, Long> {
    // Find a user by username
    List<CheckoutUserInfor> findByUsername(String username);

    // Delete a user by username and ID
    void deleteByUsernameAndId(String username, Long id);

    // This method retrieves the user by username and id to facilitate updates
    Optional<CheckoutUserInfor> findByUsernameAndId(String username, Long id);
}

