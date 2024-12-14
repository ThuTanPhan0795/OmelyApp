
// document.addEventListener("DOMContentLoaded", function () {
//     // Function to handle page changes via AJAX
//     function applySorting(page) {
//         const currentUrl = new URL(window.location.href);
//         const currentPage = page;
//         console.log(currentPage);
//         const sortingDropdown = document.querySelector('[id^="sorting-dropdown"]');
//         console.log(sortingDropdown);
//         const selectedOption = sortingDropdown.value;
//         console.log(selectedOption);
    
//         // Update the URL parameters
//         if (selectedOption) {
//             currentUrl.searchParams.set('sortBy', selectedOption);
//         } else {
//             currentUrl.searchParams.delete('sortBy');
//         }
//         currentUrl.searchParams.set('page', currentPage); // Keep the current page in the URL
    
//         // Redirect to the updated URL
//         window.location.href = currentUrl.toString();
//     }

//     // Add event listeners to pagination links
//     document.querySelectorAll(".pagination .page-link").forEach(link => {
//         link.addEventListener("click", function (event) {
//             event.preventDefault(); // Prevent default link behavior

//             // Get the page number from the data-page attribute
//             const page = this.getAttribute("data-page");
//             console.log(page);
//             if (page !== null) {
//                 applySorting(page); // Load the selected page
//             }
//         });
//     });
// });
document.addEventListener("DOMContentLoaded", function () {
    // Function to handle page changes via AJAX
    function loadProducts(page, sortBy) {
        const xhr = new XMLHttpRequest();
        const url = `/shop?page=${page}&sortBy=${sortBy}`;

        xhr.open("GET", url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        console.log("xhr " + xhr.status);
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Replace the content inside the product list with the new content
                console.log("ok1");
                console.log(document.querySelector("#product-list"));
                document.querySelector("#product-list").innerHTML = xhr.responseText;
                console.log("ok2");
                // Update pagination links
                setupPaginationLinks();
            } else {
                console.error("Error " + xhr.status + ": " + xhr.responseText);
            }
        };
        xhr.send();
    }

    // Function to set up event listeners for pagination links
    function setupPaginationLinks() {
        document.querySelectorAll(".pagination .page-link").forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault(); // Prevent default link behavior

                const page = this.getAttribute("data-page");
                const tagBox = document.querySelector(".tag-box");
                console.log("tagBox", tagBox);
                let query = null;
                if (tagBox) {
                    query = tagBox.getAttribute("data-query");
                    console.log("Query from tag-box:", query);
                }
                sortingdropdown(page , query);
            });
        });
    }

    // Initial setup for sorting dropdown
    const sortingDropdown = document.querySelector('[id^="sorting-dropdown"]');
    sortingDropdown.addEventListener("change", function () {
        const tagBox = document.querySelector(".tag-box");
        console.log("tagBox", tagBox);
        let query = null;
        if (tagBox) {
            query = tagBox.getAttribute("data-query");
            console.log("Query from tag-box:", query);
        }
        sortingdropdown(0,query);
    });
    const categorySortingDropdown = document.querySelector('#category-sorting-dropdown select');
    categorySortingDropdown.addEventListener("change", function () {
        const tagBox = document.querySelector(".tag-box");
        let query = null;
        if (tagBox) {
            query = tagBox.getAttribute("data-query");
            console.log("Query from tag-box:", query);
        }
        sortingdropdown(0,query);
    });
    const priceSortingDropdown = document.querySelector('#price-sorting-dropdown select');
    priceSortingDropdown.addEventListener("change", function () {
        const tagBox = document.querySelector(".tag-box");
        let query = null;
        if (tagBox) {
            query = tagBox.getAttribute("data-query");
            console.log("Query from tag-box:", query);
        }
        sortingdropdown(0,query);
    });

    function sortingdropdown(pageNumber ,query){
        const page = pageNumber; // Start from the first page when sorting changes
        const sortingValue = sortingDropdown ? sortingDropdown.value : null;
        const categoryValue = categorySortingDropdown ? categorySortingDropdown.value : null;
        const priceValue = priceSortingDropdown ? priceSortingDropdown.value : null;
        console.log("queryxxx "+query);
        let minPrice = '';
        let maxPrice = '';

        if (priceValue && priceValue.includes('-')) {
            const [min, max] = priceValue.split('-').map(Number); // Convert to numbers
            minPrice = min;
            maxPrice = max;
        } else if (priceValue) {
            minPrice = Number(priceValue); // For "Higher 100" case, where only minPrice is defined
            maxPrice = ''; // No max price
        }
        console.log("sortBy "+ sortingValue);
        console.log("categoryValue "+ categoryValue);
        console.log("minPrice "+ minPrice);
        console.log("maxPrice "+ maxPrice);
        console.log("queryxy "+ query);
        filterProducts(page, sortingValue, categoryValue, minPrice, maxPrice ,query);

    }

    // Set up pagination links for the first load
    setupPaginationLinks();

    // Filter button click handler
    document.querySelector(".filter-btn").addEventListener("click", function () {
        const page = 0; // Start from the first page when applying the filter
        const sortingDropdown = document.querySelector('[id^="sorting-dropdown"]');
        const sortBy = sortingDropdown.value;

        // Get selected categories
        const selectedCategories = [];
        document.querySelectorAll('.filter-widget input[type="checkbox"]:checked').forEach(checkbox => {
            selectedCategories.push(checkbox.value);
        });

        // Get the min and max price
        const minPrice = document.querySelector('#minamount').value;
        const maxPrice = document.querySelector('#maxamount').value;

        filterProducts(page, sortBy, selectedCategories, minPrice, maxPrice);
    });

    function filterProducts(page, sortBy, selectedCategories, minPrice, maxPrice , query) {
        // Remove '€' and '$' symbols from price values before passing
        // minPrice = minPrice.replace('€', '').replace('$', '').trim();
        // maxPrice = maxPrice.replace('€', '').replace('$', '').trim();

        const xhr = new XMLHttpRequest();
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("sortBy", sortBy);
        console.log("query "+ query);

        if (selectedCategories !== null) params.append("categories", selectedCategories);
        if (minPrice !== null) params.append("minPrice", minPrice);
        if (maxPrice !== null) params.append("maxPrice", maxPrice);
        if (query !== null) params.append("query", query);

        const url = `/shop_filter?${params.toString()}`;
        console.log("url "+ url);
        xhr.open("GET", url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        console.log("xhr " + xhr.status);
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Replace the content inside the product list with the new content
                console.log("ok1");
                document.querySelector("#product-list").innerHTML = xhr.responseText;
                console.log("ok2");
                // Update pagination links
                setupPaginationLinks();
                setupAddToCartButtons();
            } else {
                console.error("Error " + xhr.status + ": " + xhr.responseText);
            }

            // add remove search text function 
            const resultContainer = document.querySelector(".result-container");
    
            if (resultContainer) {
                console.log("Result Container found!");
                
                // Event delegation for .close-icon
                resultContainer.addEventListener("click", function (event) {
                    console.log("Clicked inside result container:", event.target);
                    
                    if (event.target.classList.contains("close-icon")) {
                        console.log("Close button clicked!");
                        
                        const tagBox = event.target.closest(".tag-box");
                        if (tagBox) {
                            console.log("Removing tag-box:", tagBox);
                            tagBox.remove();
                            sortingdropdown(0,null);
                        }
                    }
                });
            }   
            // end remove search text function 
        };
        xhr.send();       
    }

    const filters = document.querySelectorAll(".filter-item select"); // All dropdowns
    const filterCount = document.querySelector(".filter-count"); // Filter count badge
    const resetButton = document.querySelector(".reset-button"); // Reset button

    /**
     * Update the filter count based on selected filters.
     */
    function updateFilterCount() {
        let count = 0;
        filters.forEach(filter => {
            if (filter.value && filter.value !== filter.options[0].value) {
                count++;
            }
        });

        // Update the badge
        filterCount.textContent = count;

        // Show or hide the badge based on count
        filterCount.style.display = count > 0 ? "inline-block" : "none";
    }

    /**
     * Reset all filters to their default state.
     */
    function resetFilters() {
        filters.forEach(filter => {
            filter.selectedIndex = 0; // Reset dropdown to the first option
        });
        updateFilterCount(); // Refresh filter count
        const tagBox = document.querySelector(".tag-box");
        let query = null;
        if (tagBox) {
            query = tagBox.getAttribute("data-query");
            console.log("Query from tag-box:", query);
        }
        filterProducts(0,"newest",null,null,null,query);
    }

    // Add change event listeners to all dropdowns
    filters.forEach(filter => {
        filter.addEventListener("change", updateFilterCount);
    });

    // Add click event listener to the reset button
    resetButton.addEventListener("click", resetFilters);

    // Initialize the filter count on page load
    updateFilterCount();

    
    //search by name function 
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-btn"); // Select the button

    // Handle search button click
    searchButton.addEventListener("click", function () {
        console.log("search call");
        triggerSearch(); // Trigger search logic when the button is clicked
    });

    // Prevent form submission and trigger search logic instead
    // searchForm.addEventListener("submit", function (event) {
    //     console.log("search call");
    //     event.preventDefault(); // Prevent default form submission
    //     triggerSearch();
    // });

    function triggerSearch() {
        console.log("triggerSearch call");
        const query = searchInput.value.trim();
        // Clear the search input box after searching
        searchInput.value = "";
        if (!query) return;  
        const currentPage = window.location.pathname;
        console.log("currentPage  " + currentPage);  
        if (currentPage === "/shop") {
            // Perform AJAX search if on /shop
            sortingdropdown(0 , query);
        } else {
            // Redirect if not on /shop
            window.location.href = `/searchByProductName?query=${encodeURIComponent(query)}`;
        }
    }  

    // fix issue after filterProducts is called  'Add to Cart' buttons function is not work 
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartPopup = document.getElementById('cart-popup');
    const popupMessage = document.getElementById('popup-message');
    const closePopupButton = document.querySelector('.close-popup');

    // Function to show the popup
    function showPopup(message) {
        const popup = document.getElementById('cart-popup'); // Select popup
        const popupMessage = popup.querySelector('.popup-message'); // Select message

        popupMessage.textContent = message; // Update message content
        popup.classList.add('show'); // Add class to show popup

        // Hide the popup after 3 seconds
        setTimeout(() => {
            popup.classList.remove('show');
        }, 1000);
    }


    // Close popup when the user clicks the 'x' button
    closePopupButton.addEventListener('click', () => {
        cartPopup.style.display = 'none';
    });

    // Function to reinitialize "Add to Cart" button event listeners
    function setupAddToCartButtons() {
        console.log("setupAddToCartButtons called ");
        document.querySelectorAll(".add-to-cart-btn").forEach(button => {
            button.addEventListener("click", function () {
                console.log("addEventListener called ");
                event.preventDefault(); // Prevent default scrolling behavior
                const productId = this.getAttribute("data-product-id");
                console.log("productId  "+productId);

                // Perform the AJAX request to add the product to the cart
                addToCart(productId);
            });
        });
    }

    // Function to handle adding items to the cart
    function addToCart(productId) {
        const url = `/cart/add/${productId}`;
        console.log("url "+productId);

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add to cart');
                }
                return response.json();
            })
            .then(data => {
                showPopup(data.message);  // Show success message in popup
            })
            .catch(error => {
                console.error('Error:', error);
                showPopup('Failed to add product to cart.', 'danger');  // Show error message
            });
    }
    setupAddToCartButtons();

});
    

