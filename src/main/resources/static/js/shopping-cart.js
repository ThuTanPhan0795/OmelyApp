document.addEventListener("DOMContentLoaded", function () {
    const updateCartButton = document.querySelector(".up-cart");
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const selectAllCheckbox = document.getElementById('select-all');
    const subtotalPriceElement = document.querySelector('.subtotal-price');
    const totalCartPriceElement = document.querySelector('.total-cart-price');
    const removeLinks = document.querySelectorAll('.ti-close');
    const confirmationModal = document.getElementById('confirmationModal');
    let isChanged = false;
    let redirectUrl = ""; // To store the redirect URL

    // Function to update totals and subtotal
    function updateTotals() {
        let subtotal = 0;
        console.log("Updating totals...");

        const itemCheckboxes = document.querySelectorAll('.item-checkbox');
        itemCheckboxes.forEach((checkbox) => {
            const row = checkbox.closest('tr');
            const priceElement = row.querySelector('.p-price');
            const quantityInput = row.querySelector('.quantity-input');
            const itemTotalElement = row.querySelector('.item-total');

            const price = parseFloat(priceElement.textContent.replace('$', ''));
            const quantity = parseInt(quantityInput.value, 10);
            const totalForItem = price * quantity;

            itemTotalElement.textContent = `$${totalForItem.toFixed(2)}`; // Update item total

            console.log(`Item Total for checkbox: ${checkbox.checked}, Price: ${price}, Quantity: ${quantity}, Total: ${totalForItem}`);

            // Only add to subtotal if checked
            if (checkbox.checked) {
                subtotal += totalForItem;
                console.log(`Adding to subtotal: ${totalForItem}`);
            } else {
                console.log(`Not adding to subtotal because checkbox is unchecked.`);
            }
        });

        subtotalPriceElement.textContent = `$${subtotal.toFixed(2)}`; // Update subtotal
        totalCartPriceElement.textContent = `$${subtotal.toFixed(2)}`; // Total is the same as subtotal for selected items

        console.log(`Subtotal: ${subtotal}`);
    }

    // Enable the update button when quantity is changed
    quantityInputs.forEach(input => {
        input.addEventListener('input', function () {
            isChanged = true;
            if (updateCartButton) {
                updateCartButton.disabled = false; // Only set disabled if the button exists
            }
            updateTotals(); // Update totals on quantity change
        });
    });

    // Handle select all checkbox
    selectAllCheckbox.addEventListener('change', function () {
        const itemCheckboxes = document.querySelectorAll('.item-checkbox');
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
        updateTotals(); // Update totals when select all is checked/unchecked
    });

    // Handle individual item checkbox changes
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            isChanged = true; // Changing checkboxes counts as a change
            if (updateCartButton) {
                updateCartButton.disabled = false; // Only set disabled if the button exists
            }
            updateTotals(); // Update totals on checkbox change
            console.log(`Checkbox for product ID ${checkbox.getAttribute('data-id')} changed to: ${checkbox.checked}`);
        });
    });

    // Function to save cart
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
                    selectItem: isChecked ? 1 : 0 // Store selection state
                });
            }
        });
    
        if (cartItems.length > 0) {
            fetch("/cart/update-cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cartItems)
            })
            .then(response => {
                return response.json().then(data => {
                    if (response.ok) {
                        alert(data.message || "Cart updated successfully.");
                        if (callback) callback();
                    } else {
                        alert(`Failed to update the cart: ${data.error || "No message available"}`);
                    }
                });
            })
            .catch(error => {
                console.error("Error updating cart:", error);
                alert("An error occurred. Please try again.");
            });
        } else {
            alert("No items in the cart to save.");
        }
    }
    

    // Handle the update cart button click
    if (updateCartButton) {
        updateCartButton.addEventListener("click", function (event) {
            event.preventDefault();
            saveCart(); // Save cart on button click
        });
    }

    // Show confirmation modal when navigating away
    function showConfirmationModal() {
        confirmationModal.style.display = 'flex';
    }

    // Handle navigation links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function (event) {
            if (isChanged) {
                event.preventDefault(); // Prevent navigation
                redirectUrl = link.href; // Store the redirect URL
                showConfirmationModal(); // Show the modal

                // Handle confirmation buttons
                document.getElementById('save-cart').onclick = function () {
                    saveCart(() => {
                        confirmationModal.style.display = 'none';
                        setTimeout(() => {
                            window.location.href = redirectUrl; // Navigate after saving
                        }, 500); // Delay to allow save
                    });
                };

                document.getElementById('leave-without-saving').onclick = function () {
                    confirmationModal.style.display = 'none';
                    window.location.href = redirectUrl; // Navigate without saving
                };
            }
        });
    });

    // Handle removal of items
    removeLinks.forEach(link => {
        link.addEventListener('click', function () {
            isChanged = true;
            if (updateCartButton) {
                updateCartButton.disabled = false; // Only set disabled if the button exists
            }
            updateTotals(); // Update totals after an item is removed
        });
    });

    // Initial call to update totals when the page loads
    updateTotals();
});
