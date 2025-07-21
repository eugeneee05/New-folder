document.addEventListener('DOMContentLoaded', () => {
    // Prices and names of menu items
    const menuItems = {
        mealFish: { name: 'Fish and Chips', price: 19.90 },
        mealChicken: { name: 'Black Pepper Chicken', price: 25.50 },
        mealSpaghetti: { name: 'Spaghetti', price: 12.90 },
        mealBurger: { name: 'Chicken Burger', price: 9.90 },
        drinkCoke: { name: 'Coke', price: 4.50 },
        drinkCoffee: { name: 'Coffee', price: 3.00 },
        drinkIceCream: { name: 'Ice Cream', price: 4.00 },
        drinkLemonTea: { name: 'Lemon Tea', price: 3.00 },
    };

    // Service tax rate and item quantity limit
    const serviceTaxRate = 0.10;
    const itemLimit = 99;

    const totalPriceSpan = document.getElementById('totalPrice');
    const orderForm = document.getElementById('orderForm');
    const orderModal = document.getElementById('orderModal');
    const modalSummary = document.getElementById('modalSummary');
    const closeButton = document.querySelector('.close-button');

    // Function to calculate and update total price and subtotals
    window.calculateTotal = function() {
        let subtotal = 0;
        for (const id in menuItems) {
            const quantity = parseInt(document.getElementById(`${id}Qty`).textContent);
            const itemSubtotal = quantity * menuItems[id].price;
            subtotal += itemSubtotal;
            document.getElementById(`${id}Subtotal`).textContent = `RM${itemSubtotal.toFixed(2)}`;
        }
        
        const serviceTax = subtotal * serviceTaxRate;
        const grandTotal = subtotal + serviceTax;

        totalPriceSpan.textContent = `RM${grandTotal.toFixed(2)}`;
    };

    // Function to update item quantity
    window.updateQty = function(id, change) {
        const qtySpan = document.getElementById(`${id}Qty`);
        let currentQty = parseInt(qtySpan.textContent);
        const newQty = currentQty + change;
        
        if (newQty >= 0 && newQty <= itemLimit) {
            qtySpan.textContent = newQty;
            calculateTotal();
        }
    };

    // Function to display current date and time
    const updateDateTime = () => {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        document.getElementById('dateTime').textContent = now.toLocaleDateString('en-MY', options);
    };

    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Function to reset the form
    window.resetForm = function() {
        orderForm.reset();
        for (const id in menuItems) {
            document.getElementById(`${id}Qty`).textContent = '0';
            document.getElementById(`${id}Subtotal`).textContent = 'RM0.00';
        }
        calculateTotal();
    };

    // Function to submit the order and show the modal
    window.submitOrder = function() {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const notes = document.getElementById('notes').value;

        if (!fullName || !email || !phone) {
            alert("Please fill out all customer information fields.");
            return;
        }

        const gmailRegex = /@gmail\.com$/;
        if (!gmailRegex.test(email)) {
            alert("Please enter a valid Gmail address (e.g., example@gmail.com).");
            return;
        }
        
        if (!phone.startsWith('01')) {
            alert("Phone number must start with '01'.");
            return;
        }

        if (phone.length < 10 || phone.length > 11) {
            alert("Phone number must be between 10 and 11 digits long.");
            return;
        }

        let subtotal = 0;
        let orderSummary = `--- Order Summary ---\n`;
        orderSummary += `Name: ${fullName}\nEmail: ${email}\nPhone: ${phone}\n`;
        orderSummary += `---------------------\nYour Items:\n`;

        let hasItems = false;
        for (const id in menuItems) {
            const quantity = parseInt(document.getElementById(`${id}Qty`).textContent);
            if (quantity > 0) {
                hasItems = true;
                const itemName = menuItems[id].name;
                const itemPrice = menuItems[id].price;
                const itemSubtotal = quantity * itemPrice;
                subtotal += itemSubtotal;
                orderSummary += `- ${itemName} (x${quantity}): RM${itemSubtotal.toFixed(2)}\n`;
            }
        }

        if (!hasItems) {
            alert("Please select at least one item to order.");
            return;
        }
        
        const serviceTax = subtotal * serviceTaxRate;
        const grandTotal = subtotal + serviceTax;

        orderSummary += `\n---------------------\n`;
        orderSummary += `Subtotal: RM${subtotal.toFixed(2)}\n`;
        orderSummary += `Service Tax (10%): RM${serviceTax.toFixed(2)}\n`;
        orderSummary += `Grand Total: RM${grandTotal.toFixed(2)}\n`;
        orderSummary += `---------------------\nSpecial Requests:\n${notes || 'None'}\n`;
        orderSummary += `\n---------------------\nThank you for your order!`;

        // Display the summary in the modal
        modalSummary.textContent = orderSummary;
        orderModal.style.display = 'block';
    };

    // Event listener to close the modal when the close button is clicked
    closeButton.onclick = function() {
        orderModal.style.display = 'none';
    };

    // Event listener to close the modal if the user clicks outside of it
    window.onclick = function(event) {
        if (event.target == orderModal) {
            orderModal.style.display = 'none';
        }
    };
});