//window.addEventListener('resize',() => {
  //  location.reload();
//});
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

function CloseTopOffer() {
    document.querySelector('.coupons-nav').style.display = 'none';
}

function svmenu() {
    document.querySelector('.cat-nav-links').style.display = 'flex';
}

function ShowMenu() {
    document.getElementById('menu-btn').style.display = 'none';
    document.getElementById('menu-close-btn').style.display = 'flex';
    svmenu();
}

function CloseMenu() {
    document.getElementById('menu-close-btn').style.display = 'none';
    document.getElementById('menu-btn').style.display = 'flex';
    document.querySelector('.cat-nav-links').style.display = 'none';
}


async function send_cart_data(productId) {
    quantity = document.querySelector(`#${productId} .quantity`).textContent
    try {
        const response = await fetch('cart/add-items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken  
            },
            body: JSON.stringify({ 'PID': productId , 'Quantity': quantity }),
        });

        const data = await response.json();
        

        if (response.ok) {
            
            console.log('Success');
        } else {
            console.error('Not Added', data.error);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }

}

async function quantity_manage(productId) {
    document.querySelector(`#${productId} .increase`).addEventListener('click', function(){
        var currentValue = parseInt(document.querySelector(`#${productId} .quantity`).textContent);
        document.querySelector(`#${productId} .quantity`).textContent = currentValue + 1 ;
        send_cart_data(productId); 
   });

   document.querySelector(`#${productId} .decrease`).addEventListener('click', function(){
    var currentValue = parseInt(document.querySelector(`#${productId} .quantity`).textContent);
    if (currentValue > 0) {
        document.querySelector(`#${productId} .quantity`).textContent = currentValue - 1 ;
        send_cart_data(productId);
    }
});
}




document.addEventListener("DOMContentLoaded", function() {

    
    //Cart Count Update
    
    document.querySelectorAll(".cart-add").forEach(button => {
        button.addEventListener("click", function() {
        if(access_token) {
            
           // document.getElementById("Cart-Counter").textContent = cartCounter;
            const productId = this.getAttribute('data-id');
                console.log('Product ID:', productId);
               // 
               this.style.display='none';
               document.getElementById(productId).style.display = 'flex';
               document.querySelector(`#${productId} .quantity`).textContent = 1;

               quantity_manage(productId);
               
               send_cart_data(productId);
               alert('Item added to Cart')
            
        }
        else {
            alert('Please login to add items to your cart')
         }
        });
    });
    

  


    //Product Search
    const searchInput = document.getElementById("site-search");
    const searchImg = document.getElementById("search-img");

    searchImg.addEventListener("click", function(event) {
        event.preventDefault(); 

        // Manually trigger form submission
        const query = searchInput.value;
        const currentUrl = window.location.href.split('?')[0]; // Get the base URL without query parameters
        const redirect = `${currentUrl}?search_query=${encodeURIComponent(query)}`;

        // Redirect to the constructed URL
        window.location.href = redirect;
    });
});



//Sliding Product Containers
const productContainers = [...document.querySelectorAll('.product-container')];
const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
const preBtn = [...document.querySelectorAll('.pre-btn')];

productContainers.forEach((item, i) => {
    let containerDimensions = item.getBoundingClientRect();
    let containerWidth = containerDimensions.width;

    nxtBtn[i].addEventListener('click', () => {
        item.scrollLeft += containerWidth;
    })

    preBtn[i].addEventListener('click', () => {
        item.scrollLeft -= containerWidth;
    })
})


function foot_help() {
    document.querySelector('.help ul').style.display = 'flex';
    document.querySelector('.Close').style.display = 'flex';
    document.querySelector('.Open').style.display = 'none';
}

function foot_help_close() {
    document.querySelector('.help ul').style.display = 'none';
    document.querySelector('.Close').style.display = 'none';
    document.querySelector('.Open').style.display = 'flex';
}

function foot_social() {
    document.querySelector('.social-links ul').style.display = 'flex';
    document.getElementById('social_close').style.display = 'flex';
    document.getElementById('social_open').style.display = 'none';
}

function foot_social_close() {
    document.querySelector('.social-links ul').style.display = 'none';
    document.getElementById('social_close').style.display = 'none';
    document.getElementById('social_open').style.display = 'flex';
}

function foot_add() {
    document.querySelector('.address p').style.display = 'flex';
    document.getElementById('add_close').style.display = 'flex';
    document.getElementById('add_open').style.display = 'none';
}


function foot_add_close() {
    document.querySelector('.address p').style.display = 'none';
    document.getElementById('add_close').style.display = 'none';
    document.getElementById('add_open').style.display = 'flex';
}

let user_name;
let user_email;



async function Get_User_Data() {
    const refreshToken = localStorage.getItem('refreshToken');
    
    
    try {
        const response = await fetch('/fetch/user_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken  
            },
            body: JSON.stringify({ 'refresh_token': refreshToken }),
        });

        const data = await response.json();
        

        if (response.ok) {
            user_name = data.Name;
            user_email = data.Email;
        } else {
            console.error('Refresh Token Invalid', data.error);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

const access_token = localStorage.getItem('accessToken');


async function check_login_status() {

    
    //console.log(access_token)
    if (access_token) {
        document.getElementById('Accounts').addEventListener('click', function() {
            
                document.getElementById('User_Account_Info').style.display = 'block';
                document.querySelector('.Account_Content h3').textContent = user_name;
                document.querySelector('.Account_Content p').textContent = user_email;
            
        });

        document.querySelector('.closeBtn').addEventListener('click', function() {
            document.getElementById('User_Account_Info').style.display = 'none';
        });
    }
    else {
        document.getElementById('Accounts').addEventListener('click', function() {
            window.location.href = 'register';
        });
    }
}



async function Load_User_Data() {
    
    if (access_token) {
        await Get_User_Data();
    }
    check_login_status();
}

// Call init function to start the process
Load_User_Data();


document.querySelector('.logout-btn').addEventListener('click', function(){
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    document.getElementById('User_Account_Info').style.display = 'none';
    window.location.href = 'register';
    try {
             fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken  
            },
            body: JSON.stringify({ 'logout': 'Logout' }),
        });
    }
    catch (error) {
        console.error('Fetch error:', error);
    }
});


