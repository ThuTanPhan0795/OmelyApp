document.addEventListener("DOMContentLoaded", function () {
    const updateCartButton = document.querySelector(".up-cart");
    const quantityInputs = document.querySelectorAll(".quantity-input");
    const selectAllCheckbox = document.getElementById("select-all");
    const itemCheckboxes = document.querySelectorAll(".item-checkbox");
    const subtotalPriceElement = document.querySelector(".subtotal-price");
    const totalCartPriceElement = document.querySelector(".total-cart-price");
    const removeLinks = document.querySelectorAll(".ti-close");
    const confirmationModal = document.getElementById("confirmationModal");
    let isChanged = false;
    let redirectUrl = ""; // To store the redirect URL

    // Function to update totals and subtotal
    function updateTotals() {
        let subtotal = 0;

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
                console.log("Reverting to: " + currentValue); // Log the value being reverted to
                this.value = currentValue; // Revert to the last valid value
            } else {
                // Update current value if the input is valid
                if (!isNaN(this.value) && this.value.trim() !== "") {
                    currentValue = this.value; // Update to the new valid value
                    console.log("Current valid value: " + currentValue); // Log the new valid value
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
                showConfirmationModal();

                document.getElementById("save-cart").onclick = function () {
                    saveCart(() => {
                        confirmationModal.style.display = "none";
                        setTimeout(() => {
                            window.location.href = redirectUrl;
                        }, 500);
                    });
                };

                document.getElementById("leave-without-saving").onclick = function () {
                    confirmationModal.style.display = "none";
                    window.location.href = redirectUrl;
                };
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

    // Handle removal of items
    removeLinks.forEach((link) => {
        link.addEventListener("click", function () {
            isChanged = true;
            updateCartButton && (updateCartButton.disabled = false);
            updateTotals();
        });
    });

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
                    console.error("Error updating cart:", error);
                    alert("An error occurred. Please try again.");
                });
        } else {
            alert("No items in the cart to save.");
        }
    }

    // Call updateTotals on page load
    updateTotals();
});
