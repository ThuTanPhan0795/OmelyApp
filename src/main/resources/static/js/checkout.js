document.addEventListener("DOMContentLoaded", function () {
    const subtotalPriceElement = document.querySelector(".subtotal-price");
    const totalCartPriceElement = document.querySelector(".total-cart-price");
    const itemRows = document.querySelectorAll(".cart-item");

    // Function to update totals and subtotal
    function updateTotals() {
        let subtotal = 0;

        // Loop through each item row
        itemRows.forEach((row) => {
            const priceElement = row.querySelector(".p-price"); // Price element in the row
            const quantityElement = row.querySelector(".total-price h5"); // Quantity element in the row
            const itemTotalElement = row.querySelector(".item-total"); // Element to display total for this item

            // Parse price and quantity
            const price = parseFloat(priceElement.textContent.replace("$", "").replace(",", "")); // Remove dollar sign and comma
            const quantity = parseInt(quantityElement.textContent, 10) || 0; // Get quantity, default to 0 if empty
            const totalForItem = price * quantity; // Calculate total for this item

            // Update item total display
            itemTotalElement.textContent = `$${totalForItem.toFixed(2)}`; // Update item total

            // Add to subtotal
            subtotal += totalForItem;
        });

        // Update subtotal and total cart price displays
        subtotalPriceElement.textContent = `$${subtotal.toFixed(2)}`;
        totalCartPriceElement.textContent = `$${subtotal.toFixed(2)}`;
    }

    // Call updateTotals on page load
    updateTotals();
});
