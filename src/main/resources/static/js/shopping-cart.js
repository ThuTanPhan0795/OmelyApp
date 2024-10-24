document.addEventListener("DOMContentLoaded", function () {
    const updateCartButton = document.querySelector(".up-cart");

    if (updateCartButton) {
        updateCartButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent the default anchor click behavior

            // Collect all selected items from the cart
            const cartItems = []; // Create an array to hold cart items
            const cartItemElements = document.querySelectorAll(".cart-item"); // Select all cart item elements

            cartItemElements.forEach((itemElement) => {
                const productId = itemElement.querySelector(".quantity-input").getAttribute("data-id");
                const itemQuantity = itemElement.querySelector(".quantity-input").value;

                // Log for debugging
                console.log(`Product ID : ${productId}, Quantity: ${itemQuantity}`);
                // Push the item details into the cartItems array
                if (itemQuantity > 0) { // Only include items with a quantity greater than 0
                    cartItems.push({
                        id: parseInt(productId),// Change to 'productId' if needed
                        quantity: parseInt(itemQuantity) // Ensure quantity is an integer
                    });
                }
            });

            // Check if there are items to update
            if (cartItems.length === 0) {
                alert("No items selected to update the cart.");
                return; // Exit the function if there are no items
            }

            // Send a POST request to update the cart
            fetch("/cart/update-cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cartItems) // Convert the cartItems array to JSON
            })
            .then((response) => {
                return response.json().then((data) => {
                    if (response.ok) {
                        // Show success message and reload the page if the update was successful
                        alert(data.message || "Cart updated successfully.");
                        location.reload();
                    } else {
                        // Show an error message from the server response
                        alert(`Failed to update the cart: ${data.error || "No message available"}`);
                    }
                });
            })
            .catch((error) => {
                console.error("Error updating cart:", error);
                alert("An error occurred. Please try again.");
            });
        });
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const updateCartButton = document.getElementById('update-cart-btn');
    const selectAllCheckbox = document.getElementById('select-all');
    const subtotalPriceElement = document.querySelector('.subtotal-price');
    const totalCartPriceElement = document.querySelector('.total-cart-price');

    let isChanged = false;

    // Function to update totals and subtotal
    function updateTotals() {
        let subtotal = 0;
        let total = 0;

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
            total += totalForItem; // Update total

            if (checkbox.checked) {
                subtotal += totalForItem; // Only add to subtotal if checked
            }
        });

        subtotalPriceElement.textContent = `$${subtotal.toFixed(2)}`; // Update subtotal
        totalCartPriceElement.textContent = `$${subtotal.toFixed(2)}`; // Total is the same as subtotal for selected items
    }

    // Enable the update button when quantity is changed
    quantityInputs.forEach(input => {
        input.addEventListener('input', function () {
            isChanged = true;
            updateCartButton.disabled = false;
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
            isChanged = true; // Assuming changing checkboxes is a change
            updateCartButton.disabled = false;
            updateTotals(); // Update totals on checkbox change
        });
    });

    // Confirm navigation away if there are unsaved changes
    window.addEventListener('beforeunload', function (event) {
        if (isChanged) {
            const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?';
            event.returnValue = confirmationMessage; // For most browsers
            return confirmationMessage; // For Firefox
        }
    });

    // Handle removal of items
    const removeLinks = document.querySelectorAll('.ti-close');
    removeLinks.forEach(link => {
        link.addEventListener('click', function () {
            isChanged = true;
            updateCartButton.disabled = false;
            updateTotals(); // Update totals after an item is removed
        });
    });
});