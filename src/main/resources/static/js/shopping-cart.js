document.addEventListener("DOMContentLoaded", function () {
    const updateCartButton = document.querySelector(".up-cart");
    const quantityInputs = document.querySelectorAll(".quantity-input");
    const selectAllCheckbox = document.getElementById("select-all");
    let itemCheckboxes = document.querySelectorAll(".item-checkbox");
    const subtotalPriceElement = document.querySelector(".subtotal-price");
    const totalCartPriceElement = document.querySelector(".total-cart-price");
    const removeLinks = document.querySelectorAll("#delete-item");
    const confirmationModal = document.getElementById("confirmationModal");
    let isChanged = false;
    let redirectUrl = ""; // To store the redirect URL

    // Function to update totals and subtotal
    function updateTotals() {
        let subtotal = 0;
        itemCheckboxes = document.querySelectorAll(".item-checkbox");

        itemCheckboxes.forEach((checkbox) => {
            const row = checkbox.closest("tr");
            const priceElement = row.querySelector(".p-price");
            const quantityInput = row.querySelector(".quantity-input");
            const itemTotalElement = row.querySelector(".item-total");

            const price = parseFloat(priceElement.textContent.replace("$", "").replace(",", "")); // Handle potential formatting
            const quantity = parseInt(quantityInput.value, 10) || 0; // Default to 0 if input is not valid
            const totalForItem = price * quantity;

            itemTotalElement.textContent = `$${totalForItem.toFixed(2)}`; // Update item total

            if (checkbox.checked) {
                subtotal += totalForItem;
            }
        });

        subtotalPriceElement.textContent = `$${subtotal.toFixed(2)}`;
        totalCartPriceElement.textContent = `$${subtotal.toFixed(2)}`;
    }

    // Handle quantity input changes
    quantityInputs.forEach((input) => {
        let currentValue = input.value; // Store the initial value when the input is created

        input.addEventListener("input", function () {
            isChanged = true; // Mark cart as changed
            updateCartButton && (updateCartButton.disabled = false); // Enable the update button

            // Update currentValue only if the new input is a valid number
            if (!isNaN(this.value) && this.value.trim() !== "") {
                currentValue = this.value; // Update to the current value if valid
            }
            updateTotals(); // Recalculate totals
        });

        input.addEventListener("blur", function () {
            if (this.value.trim() === "") {
                // If input is blank, revert to the last valid value
                // console.log("Reverting to: " + currentValue); // Log the value being reverted to
                this.value = currentValue; // Revert to the last valid value
            } else {
                // Update current value if the input is valid
                if (!isNaN(this.value) && this.value.trim() !== "") {
                    currentValue = this.value; // Update to the new valid value
                    // console.log("Current valid value: " + currentValue); // Log the new valid value
                }
            }
            updateTotals(); // Ensure totals are updated after blur event
        });
    });

    // Handle "Select All" checkbox changes
    selectAllCheckbox.addEventListener("change", function () {
        isChanged = true; // Mark as changed when Select All is used
        itemCheckboxes.forEach((checkbox) => {
            checkbox.checked = selectAllCheckbox.checked;
        });
        updateTotals();
    });

    // Handle individual item checkbox changes
    itemCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            isChanged = true;
            updateCartButton && (updateCartButton.disabled = false);
            updateTotals();
        });
    });

    // Show confirmation modal when navigating away
    function showConfirmationModal() {
        confirmationModal.style.display = "flex";
    }

    // Handle navigation links
    document.querySelectorAll('a[href^="./"]').forEach((link) => {
        link.addEventListener("click", function (event) {
            if (isChanged && !link.getAttribute("href").endsWith("check-out")) {
                event.preventDefault();
                redirectUrl = link.href;
                // showConfirmationModal();

                // document.getElementById("save-cart").onclick = function () {
                saveCart(() => {
                    confirmationModal.style.display = "none";
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 500);
                });
                // };

                // document.getElementById("leave-without-saving").onclick = function () {
                //     confirmationModal.style.display = "none";
                //     window.location.href = redirectUrl;
                // };
            }
        });
    });

    // Handle navigation links for checkout
    document.querySelectorAll('a[href^="./check-out"]').forEach((link) => {
        link.addEventListener("click", function (event) {
            var anySelected = false;
            var checkboxes = document.querySelectorAll('.item-checkbox');
            
            // Check if at least one checkbox is selected
            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    anySelected = true;
                }
            });
        
            // If no item is selected, show the error and stop further action
            if (!anySelected) {
                event.preventDefault();  // Prevent the page navigation
                document.getElementById("error-message").style.display = "block";  // Show error message
            } else {
                // If items are selected, proceed to checkout by triggering navigation manually
                document.getElementById("error-message").style.display = "none";  // Hide error message
                if (isChanged) {
                    event.preventDefault(); // Prevent the default link action
    
                    // Save the cart before navigating
                    saveCart(() => {
                        // Redirect to the checkout page after saving the cart
                        window.location.href = link.href; // Navigate to checkout
                    });
                } else {
                    // No changes, directly navigate to the checkout page
                    window.location.href = link.href; // Navigate to checkout
                }
            }
        });
    });

    // Handle removal of items via Ajax
    removeLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior

            const productId = this.getAttribute("data-product-id");
            const row = this.closest("tr");

            // console.log(`Attempting to remove product with ID: ${productId}`);

            fetch(`/cart/remove/${productId}`, {
                method: "DELETE",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    if (response.ok) {
                        // Remove the item's row from the DOM
                        if (row) row.remove();
                        // console.log(`Product with ID: ${productId} removed successfully.`);

                        isChanged = true;

                        // Re-select updated checkboxes and inputs after item removal
                        refreshCartElements();

                        // Explicitly recalculate totals after removal
                        updateTotals();

                        updateCartButton && (updateCartButton.disabled = false); // Enable update button
                    } else {
                        alert("Failed to remove the item. Please try again.");
                    }
                })
                .catch((error) => {
                    // console.error("Error removing item:", error);
                    alert("An error occurred. Please try again.");
                });
        });
    });

    // Function to refresh cart elements after DOM changes
    function refreshCartElements() {
        // Use let here instead of const to reassign the variables
        let itemCheckboxes = document.querySelectorAll(".item-checkbox");
        if (itemCheckboxes.length == 0){
            clearAllCartTables ();
        }
        //let quantityInputs = document.querySelectorAll(".quantity-input");

        // console.log("Cart elements refreshed. Remaining items:", itemCheckboxes.length);
    }
    document.getElementById("delete-all").addEventListener("click", function () {
        // Confirm with the user before deleting all items
        if (!confirm("Are you sure you want to delete all items from the cart?")) {
            return;
        }
    
        fetch("/cart/remove-all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",  // Optional, but good practice
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete all items, server responded with status: " + response.status);
            }
            return response.json();
        })
        .then(data => {
           // Handle successful removal
            console.log("All items removed successfully:", data.message);

            clearAllCartTables ();
    
            // Recalculate totals (make sure this function is available)
            //updateTotals();
        })
        .catch(error => {
            console.error("Error deleting all items:", error);
        });
    });

    function clearAllCartTables (){
        // Safely clear all cart tables (check if elements with the ID exist)
        const cartTables = document.querySelectorAll("#cart-table");  // Use querySelectorAll to get all matching elements
        if (cartTables.length > 0) {
            cartTables.forEach(cartTable => {
                cartTable.innerHTML = ""; // Clear each table's contents
                console.log("Cart table cleared successfully.");
            });
            // Create and insert the empty cart message
            const emptyCartMessage = document.createElement('div');
            emptyCartMessage.classList.add('col-12', 'mb-3');
            emptyCartMessage.innerHTML = `
                <h6>Your shopping cart is empty! Please select the items in the shop page.</h6>
            `;

            // Get the cart container by its ID
            const cartContainer = document.getElementById('cart-container'); // Ensure you're targeting the correct container
            if (cartContainer) {
                cartContainer.appendChild(emptyCartMessage); // Append the empty cart message
            } else {
                console.error("Cart container with ID 'cart-container' not found.");
            }
        } else {
            console.error("Cart tables not found.");
        }
    }
    
    
    // Save cart function
    function saveCart(callback) {
        const cartItems = [];
        const cartItemElements = document.querySelectorAll(".cart-item");

        cartItemElements.forEach((itemElement) => {
            const productId = itemElement.querySelector(".quantity-input").getAttribute("data-id");
            const itemQuantity = itemElement.querySelector(".quantity-input").value;
            const isChecked = itemElement.querySelector(".item-checkbox").checked;

            if (itemQuantity > 0) {
                cartItems.push({
                    id: parseInt(productId),
                    quantity: parseInt(itemQuantity),
                    selectItem: isChecked ? 1 : 0
                });
            }
        });

        if (cartItems.length > 0) {
            fetch("/cart/update-cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cartItems)
            })
                .then((response) => response.json().then((data) => {
                    if (response.ok) {
                        callback && callback();
                    } else {
                        alert(`Failed to update the cart: ${data.error || "No message available"}`);
                    }
                }))
                .catch((error) => {
                    // console.error("Error updating cart:", error);
                    alert("An error occurred. Please try again.");
                });
        } else {
             // Navigate to the next page without saving
            if (redirectUrl) {
                window.location.href = redirectUrl; // Redirect to the saved URL
            } else {
                console.log("No redirect URL available.");
            }
        }
    }

    // Call updateTotals on page load
    updateTotals();
});
