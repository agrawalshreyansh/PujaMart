document.querySelector('.cart-details').addEventListener('click', function(){
    window.location.href='/cart/';
});



async function Discount_Coupon(event) {
    event.preventDefault();

    Coupon = document.getElementById('PromoCode').value;
    const this_csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

    try {
        const response = await fetch('/checkout/check_code/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this_csrfToken  
            },
            body: JSON.stringify({ 'code': Coupon }),
        });

        const data = await response.json();
        

        if (response.ok) { 
            total = data.Total_Value
            Discount = data.Discount
            Shipping = data.shipping

            discount_amount = [(total-Shipping)*(data.Discount)]/100;
            saving_amount = total - Shipping - discount_amount

            document.querySelector('.coup_discount').textContent = discount_amount;
            document.querySelector('.total_value').textContent = total - discount_amount;
            document.querySelector('.total_saving').textContent = saving_amount;
            
            
        } 
        else {
            alert(data.error);
        }
    } 
    catch (error) {
        console.error('Fetch error:', error);
    }
}


document.getElementById('code-container').addEventListener('submit', Discount_Coupon);


document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.address_form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Collect form data
        const formData = new FormData(form);

        // Prepare data to send
        const data = {
            full_name: formData.get('full_name'),
            phone: formData.get('Phone'),
            building: formData.get('Building'),
            area: formData.get('Area'),
            landmark: formData.get('Landmark') || '', // Default to empty string if not provided
            pincode: formData.get('Pincode'),
            town: formData.get('Town'),
            state: formData.get('state')
        };

        try {
            // Send POST request
            const response = await fetch('/checkout/save_address/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken') // Include CSRF token
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Handle successful response
                console.log('Form submitted successfully');
                // You can add more actions here, like redirecting or showing a success message
            } else {
                // Handle errors
                console.error('Form submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
