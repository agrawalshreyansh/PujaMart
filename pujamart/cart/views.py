from django.shortcuts import render
from django.http import JsonResponse
import json
from .models import Cart_Items
from accounts.models import Registered_Users
from Corelanding.models import *
from django.shortcuts import get_object_or_404

def cart(request):
    user_cart_items = Cart_Items.objects.filter(Email=request.session.get('mail'))

    product_details = []
    
    for item in user_cart_items:
        product_id = item.ProductID
        prefix = product_id[:2]
        id_number = product_id[2:]

        if prefix == 'BS':
            product = BestSellers.objects.filter(id=id_number).first()
        elif prefix == 'FP':
            product = FeaturedProducts.objects.filter(id=id_number).first()
        else:
            product = None

        if product:
            product_details.append({
                'Id':item.ProductID,
                'Name': product.name,  
                'MRP': product.marked_price,
                'SP' : product.selling_price, 
                'Quantity': item.Quantity,
                'Image': product.image.url if product.image else None
            })
    return render(request, 'cart.html', {'cart_items': product_details,})



def rec_cart_data(request):
    if request.method == 'POST':
        body = json.loads(request.body.decode('utf-8'))
        ProductID = body.get('PID')
        quantity = body.get('Quantity')
        email = request.session.get('mail')

        user = get_object_or_404(Registered_Users, Email=email)

        instance, created = Cart_Items.objects.update_or_create(
        Email=user,
        ProductID = ProductID,
        defaults={'Quantity': quantity}
         )

        return JsonResponse({'message' : 'Success'})
    else:
        return JsonResponse({'error': 'Invalid Request'})


def delete_cart_items(request):
    if request.method == 'POST':
        body = json.loads(request.body.decode('utf-8'))
        ProductID = body.get('PID')
        user_email = request.session.get('mail') 
    
        if ProductID:
            cart_item = get_object_or_404(Cart_Items, Email=user_email, ProductID=ProductID)
            cart_item.delete()
            return JsonResponse({'message' : 'Success'})
        else:
            return JsonResponse({"message" : 'Id error'})
        
    else:   
        return JsonResponse({'error': 'Invalid Request'})  