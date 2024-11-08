from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_protect
from rest_framework_simplejwt.tokens import RefreshToken
from random import randint
import smtplib
import ssl
from email.message import EmailMessage
from .models import Registered_Users
import uuid
from django.utils import timezone
import jwt
from django.shortcuts import get_object_or_404

# Global variable for OTP
stored_otp = randint(100000, 1000000)


def send_email(email):
    global stored_otp
    stored_otp = randint(100000, 1000000)  # Generate a new OTP each time

    email_sender = "contactcode.ag@gmail.com"
    email_pwd = "jjeb gqfz sdrp osxo"

    subject = "OTP Verification"
    body = f"Your OTP for verification is: {stored_otp}"
    em = EmailMessage()
    em['From'] = email_sender
    em['To'] = email
    em['Subject'] = subject
    em.set_content(body)

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        smtp.login(email_sender, email_pwd)
        smtp.sendmail(email_sender, email, em.as_string())


@csrf_protect
def user_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        if Registered_Users.objects.filter(Email__iexact=email).exists():
            send_email(email)
            user = Registered_Users.objects.get(Email=email)
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            return JsonResponse({
                'message': 'OTP sent',
                'otp': str(stored_otp),
                'access_token': access_token,
                'refresh_token': refresh_token,
                'name': f'{user.First_Name} {user.Last_Name}',
            })
        else:
            return JsonResponse({'message': 'User Doesn’t Exist'})
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_protect
def user_register(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        recieve_ads = request.POST.get('recieve_ads')

        if Registered_Users.objects.filter(Email=email).exists():
            return JsonResponse({'message': 'User Already Exists'})
        else:
            send_email(email)

        request.session['email'] = email  # Store the email in the session
        request.session['first_name'] = first_name
        request.session['last_name'] = last_name
        request.session['phone'] = phone
        request.session['recieve_ads'] = recieve_ads

        return JsonResponse({'message': 'OTP sent'})

    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_protect
def user_creation(request):
    if request.method == 'POST':
        otp = request.POST.get('otp')
        if str(otp) == str(stored_otp):  # Verify OTP from session
            recieve_ads = request.session.get('recieve_ads') == 'on'
            user = Registered_Users(
                First_Name=request.session.get('first_name'),
                Last_Name=request.session.get('last_name'),
                Email=request.session.get('email'),
                Phone_Number=request.session.get('phone'),
                Recieve_ADs=recieve_ads
            )
            user.save()

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            return JsonResponse({
                'message': 'OTP verified',
                'access_token': access_token,
                'refresh_token': refresh_token
            })
        else:
            return JsonResponse({'error': 'Invalid OTP'}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)


def validate_access_token(token, refresh_token_view=None):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        exp = payload.get('exp')
        if exp and timezone.now() > timezone.datetime.fromtimestamp(exp):
            if refresh_token_view:
                refresh_token_view(request)
            else:
                return 'No refresh token given'
        return payload
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Token has expired')
    except jwt.InvalidTokenError:
        raise AuthenticationFailed('Invalid token')


def refresh_token_view(request):
    if request.method == 'POST':
        refresh_token = request.POST.get('refresh_token')
        try:
            user = Registered_Users.objects.get(refresh_token=refresh_token)
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return JsonResponse({'access_token': access_token})
        except Registered_Users.DoesNotExist:
            return JsonResponse({'error': 'Invalid refresh token'}, status=400)
    else:
        return HttpResponse('Invalid Request')


def user_logout(request):
    return render(request)
