


async function User_Cart_Contents() {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
       // const isValid = await verifyToken(accessToken);
      //  if (isValid) {
            document.querySelector('.cart-title').textContent = 'My Puja Cart';
        }
     else {
        document.querySelector('.cart-title').textContent = 'Please log in first to add items to your cart';
        document.querySelector('.back-btn').style.display = 'none';
        document.querySelector('.cart-display').style.display = 'none';
    }
}

User_Cart_Contents();

const n_csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

async function delete_item(productId) {
    try {
        const response = await fetch('delete_item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': n_csrfToken  
            },
            body: JSON.stringify({ 'PID': productId }),
        });

        const data = await response.json();
        

        if (response.ok) {
            // Reload the current page
            //location.reload();
            document.getElementById(productId).remove();
            console.log(data.message);
        } else {
            console.error('Not Deleted', data.error);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    
    document.querySelectorAll(".item-delete").forEach(button => {
        button.addEventListener("click", function() {
            const productId = this.closest('.cart-items').id;
            delete_item(productId)
        });
    });
});

    document.querySelector('.go_back').addEventListener('click', function(){
        window.location.href = document.referrer
    });