

from datetime import datetime, timedelta
import jwt
from django.conf import settings
from django.utils import timezone

def jwt_payload_handler(user):
    payload =  {
        'first_name': user.First_Name,
        'last_name': user.Last_Name,
        'email': user.Email,
        'refresh_token': user.refresh_token,
        'phone': user.Phone_Number,
        'recieve_ads': user.Recieve_ADs,
        'exp': timezone.now() + timedelta(days=15)  # Token expiration time
    }
    
    return payload


def jwt_encode_handler(payload):
    secret_key = str(settings.SECRET_KEY)
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

def jwt_decode_handler(token):
    options = {'verify_exp': True}
    secret_key = str(settings.SECRET_KEY)
    return jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'], options=options)
