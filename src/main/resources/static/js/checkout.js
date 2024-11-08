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
            console.log(index);
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
            console.log(addressData);

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
            // .then(response => response.json())
            .then(data => {
                alert('Address saved successfully!');
            })
            .catch(error => {
                console.error('Error saving address:', error);
                alert('An error occurred while saving the address. Please try again.');
            });
        });
    });

    $(document).ready(function() {
        // Function to handle the click on the place order button
        $('.place-btn').on('click', function(e) {
            e.preventDefault();
            
            // Get the selected address radio button
            let selectedAddress = $('input[name="selectedAddress"]:checked');
            // Extract the ID from the selectedAddress jQuery object
            let selectedAddressID = selectedAddress.attr('id');
            console.log("Selected Address ID: ", selectedAddressID);

            // Extract the index from the ID (e.g., "address0" -> 0)
            let addressIndex = selectedAddressID ? selectedAddressID.replace('address', '') : undefined;
            console.log("Extracted Address Index: ", addressIndex);
                // Log the selected address and index for debugging
                // console.log("Selected Address ID: ", selectedAddress.attr('id'));
                // console.log("Address Index: ", addressIndex);
            
            // Collect the address data based on the index
            let addressData = {
                firstName: $('input[name="firstName_' + addressIndex + '"]').val() || $('input[name="firstName_' + addressIndex + '"]').attr('placeholder'),
                lastName: $('input[name="lastName_' + addressIndex + '"]').val() || $('input[name="lastName_' + addressIndex + '"]').attr('placeholder'),
                email: $('input[name="email_' + addressIndex + '"]').val() || $('input[name="email_' + addressIndex + '"]').attr('placeholder'),
                mobileNo: $('input[name="mobileNo_' + addressIndex + '"]').val() || $('input[name="mobileNo_' + addressIndex + '"]').attr('placeholder'),
                address: $('input[name="address_' + addressIndex + '"]').val() || $('input[name="address_' + addressIndex + '"]').attr('placeholder'),
                district: $('input[name="district_' + addressIndex + '"]').val() || $('input[name="district_' + addressIndex + '"]').attr('placeholder'),
                country: $('select[name="country_' + addressIndex + '"]').val(), // Assuming this is a select input
                city: $('input[name="city_' + addressIndex + '"]').val() || $('input[name="city_' + addressIndex + '"]').attr('placeholder'),
                zipCode: $('input[name="zipCode_' + addressIndex + '"]').val() || $('input[name="zipCode_' + addressIndex + '"]').attr('placeholder')
            };
            
            // Log the address data object for debugging
            console.log("Address Data: ", addressData);
            
            // Collect the product data (product id, quantity, and total price)
            let products = [];
            $('.cart-item').each(function() {
                let product = {
                    id: $(this).find('.cart-title').attr('id'), // Fetching product id
                    quantity: $(this).find('.total-price h5').text(),
                    // totalPrice: $(this).find('.item-total').text()
                };
                products.push(product);
            });
            
            // Collect the total price
            let totalPrice = $('.total-cart-price').text();
            
            // Create the data object to send in the AJAX request
            let orderData = {
                address: addressData,
                products: products,
                totalPrice: totalPrice
            };
            
            // Log the order data for debugging
            console.log(orderData);
            
            // Make the AJAX request to the server
            $.ajax({
                url: '/place-order', // Your server endpoint for placing an order
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(orderData),
                success: function(response) {
                    alert('Order placed successfully!');
                },
                error: function(xhr, status, error) {
                    alert('There was an error placing the order. Please try again.');
                }
            });
        });
    });

    // Get all radio buttons and collapsible elements
    const radioButtons = document.querySelectorAll('.address-radio');
    const collapsibleElements = document.querySelectorAll('.address-collapse');

    // Add click event listeners to each radio button
    radioButtons.forEach((radio, index) => {
        radio.addEventListener('change', function() {
            // Hide all collapsible elements
            collapsibleElements.forEach(collapse => {
                collapse.classList.remove('show');
            });

            // Show the collapsible element associated with the checked radio button
            if (radio.checked) {
                const targetId = radio.getAttribute('data-target');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.classList.add('show');
                }
            }
        });
    });
    
    

    // Call updateTotals on page load
    updateTotals();
});
