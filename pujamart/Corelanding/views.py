from django.shortcuts import render
from django.http import JsonResponse
from .models import BestSellers, FeaturedProducts
from django.views.decorators.csrf import csrf_exempt
from accounts.models import Registered_Users
import json

def home(request):
    BestSeller = BestSellers.objects.all()
    FeaturedProduct = FeaturedProducts.objects.all()
    return render(request, 'index.html', {'BestSeller': BestSeller, 'FeaturedPro':FeaturedProduct})




def send_user_data(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body.decode('utf-8'))
            refresh_token = body.get('refresh_token')
            

            user = Registered_Users.objects.get(refresh_token=refresh_token)
            
            Name = user.First_Name + user.Last_Name
            Email = user.Email
            request.session['mail'] = Email

            return JsonResponse({'Name': Name, 'Email': str(Email)})

        except Registered_Users.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


def logout(request):
    if request.method == 'POST':
        body = json.loads(request.body.decode('utf-8'))
        data = body.get('logout')

        if data == 'Logout':
            request.session.flush()

            return JsonResponse({"message" : 'Success'})
        
    
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)