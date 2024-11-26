package com.syqu.shop.domain;

public class OrderStatus {
    public static final int WAITING_FOR_CONFIRMATION = 1;  // The order is in the process of being validated by the system
    public static final int WAITING_FOR_PICKUP = 2;       // The order has been forwarded to the Seller for delivery to the shipping unit
    public static final int DELIVERING = 3;               // The order is being delivered to the Buyer
    public static final int EVALUATION = 4;               // The order is waiting for product evaluation
    public static final int DELIVERED = 5;                // The order has been successfully delivered to the Buyer
    public static final int CANCELLED = 6;                // The order has been successfully canceled
    public static final int RETURN = 7;            
}
