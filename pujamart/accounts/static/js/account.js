function register_form() {
    document.querySelector('.Login-form').style.display = 'none';
    document.querySelector('.Registration-form').style.display = 'flex';
    document.querySelector('.login_otp_container').style.display = 'none';

}

function login_form() {
    document.querySelector('.Registration-form').style.display = 'none';
    document.querySelector('.Login-form').style.display = 'flex';
    document.querySelector('.otp_container').style.display = 'none';


}


//Store Tokens 
function storeTokens(tokens) {
    localStorage.setItem('accessToken', tokens.access_token);
    localStorage.setItem('refreshToken', tokens.refresh_token);

    return 'Tokens Stored Successfully';
}
// Token Refresh
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('/refresh-token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('accessToken', data.access_token);
        console.log('Access token refreshed:', data.access_token);
    } else {
        console.error('Token refresh failed:', data.error);
    }
}


// User Registration
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('Registration-form').addEventListener('submit', handleRegistration);
    document.getElementById('otp_container').addEventListener('submit', handleOTPVerification);
    document.getElementById('Login-form').addEventListener('submit', handleLogin);
    document.getElementById('login_otp_container').addEventListener('submit', verifyOTP);
    
});

async function handleRegistration(event) {
    event.preventDefault();  // Prevent the form from submitting normally

    const email = document.getElementById('email').value;
    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const phone = document.getElementById('Phone_Number').value;
    const ads = document.getElementById('ads').checked;
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

    try {
        const response = await fetch('/user_register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken
            },
            body: new URLSearchParams({
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'phone': phone,
                'recieve_ads': ads ? 'on' : 'off',
                'csrfmiddlewaretoken': csrfToken
            })
        });
        const data = await response.json();
        
        if (data.message === 'OTP sent') {
            alert('OTP Sent');
            document.getElementById('otp_container').style.display = 'flex';
            document.querySelector('.recieveads').style.display = 'none';
            document.querySelector('.login-btn').style.display = 'none';
            document.getElementById('form-submit').style.display = 'none';
        } else if (data.message === 'User Already Exists') {
            alert('Please use a different email id. User Already Exists.');
        } else {
            alert('Error sending OTP');
        }
    } catch (error) {
        alert('Error sending OTP');
    }
}

let gen_otp;
let tokens = {};


async function handleOTPVerification(event) {
    event.preventDefault();  // Prevent the form from submitting normally

    const otp = document.getElementById('otp').value;
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

    try {
        const response = await fetch('/user_logged_in/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken
            },
            body: new URLSearchParams({
                'otp': otp,
                'csrfmiddlewaretoken': csrfToken
            })
        });
        const data = await response.json();
        
        if (data.message === 'OTP verified') {
            alert('OTP verified successfully!');
            tokens = { 'access_token': data.access_token,
                       'refresh_token': data.refresh_token }
            // Call the store_tokens function
            const successMessage = storeTokens(tokens);
            
            // Return verification success message
            alert(successMessage);
            window.location.href = '/cart';
            return 'OTP verified successfully!';
            // You can redirect or perform other actions here
        } else {
            alert('Invalid OTP');
        }
    } catch (error) {
        alert('Error verifying OTP');
    }
}
 


async function handleLogin(event) {
    event.preventDefault();  // Prevent the form from submitting normally

    const email = document.getElementById('login_email').value;
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

    try {
        const response = await fetch('/user_login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken
            },
            body: new URLSearchParams({
                'email': email,
                'csrfmiddlewaretoken': csrfToken
            })
        });
        const data = await response.json();
        
        if (data.message === 'OTP sent') {
            alert('OTP Sent');
            gen_otp = data.otp
            tokens = { 'access_token': data.access_token,
                       'refresh_token': data.refresh_token } 
            
            document.querySelector('.login_otp_container').style.display = 'flex';
            document.querySelector('.login-submit-btn').style.display = 'none';
            document.getElementById('login-form-submit').style.display = 'none';
        } 
        else if (data.message === 'User Doesnt Exist') {
            alert('Please use a different email id. User Doesnt Exist.');
        } 
        else {
            alert('Error sending OTP');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('Error sending OTP');
    }
}



//OTP Verification and Tokens Storage
async function verifyOTP(event) {
    event.preventDefault();  // Prevent the form from submitting normally

    const form = document.getElementById('login_otp_container');
    const otpInput = document.getElementById('login_otp').value;

    // Check if the OTP matches
    if (otpInput === gen_otp) {
        try {
            // Call the store_tokens function
            const successMessage = storeTokens(tokens);
            
            // Return verification success message
            alert(successMessage);
            window.location.href = '/';

            return 'OTP verified successfully!';
        } catch (error) {
            console.error('Error storing tokens:', error);
            alert('Error storing tokens');
        }
    } 
    else {
        alert('Invalid OTP');
        return 'OTP verification failed. Please try again.';
    }
}



