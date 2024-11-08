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
    const billingAddresses = {
        1: "John Doe, 123 Main St, New York, NY 10001",
        2: "Jane Smith, 456 Market St, Los Angeles, CA 90001",
        3: "Bob Johnson, 789 Elm St, Chicago, IL 60601"
    };
    
    function showPreview(id) {
        const billingPreview = document.getElementById("billingPreview");
        const billingDetails = document.getElementById("billingDetails");
        billingDetails.innerText = billingAddresses[id];
        billingPreview.style.display = "block";
    }
    

    // Select all save buttons
    document.querySelectorAll('.save-address-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            const userId = document.querySelector(`input[name='firstName_${index}']`).getAttribute('data-id');
            // Collect the data from the form fields for this address section
            const addressData = {
                id: userId,
                firstName: getInputValue(`input[name='firstName_${index}']`),
                lastName: getInputValue(`input[name='lastName_${index}']`),
                email: getInputValue(`input[name='email_${index}']`),
                mobileNo: getInputValue(`input[name='mobileNo_${index}']`),
                address: getInputValue(`input[name='address_${index}']`),
                district: getInputValue(`input[name='district_${index}']`),
                country: document.querySelector(`select[name='country_${index}']`).value, // Select value will be directly used
                city: getInputValue(`input[name='city_${index}']`),
                zipCode: getInputValue(`input[name='zipCode_${index}']`)
            };
            // Function to check if the field is empty and return the placeholder value if it is
            // Function to check if the field is empty and return the placeholder value if it is
            function getInputValue(selector) {
                const inputElement = document.querySelector(selector);
                return inputElement.value.trim() === '' ? inputElement.placeholder : inputElement.value;
            }
    
            // Send the data to the backend via AJAX
            fetch('/saveAddress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addressData)
            })
            //.then(response => response.json())
            .then(data => {
                alert('Address saved successfully!');
            })
            .catch(error => {
                console.error('Error saving address:', error);
            });
        });
    });
    // Call updateTotals on page load
    updateTotals();
});
