from django.shortcuts import render
from django.http import JsonResponse
from accounts.models import *
from Corelanding.models import *
from cart.models import *
import json
from .models import *
from django.shortcuts import get_object_or_404




def coupons(request):
    if request.method == 'POST':
        body = json.loads(request.body.decode('utf-8'))
        Coupon_code = body.get('code')
        
        try:
            coupon = Coupon_Codes.objects.get(Codes=Coupon_code)
            DiscountP = coupon.Discount
          
            
            return JsonResponse({'message': 'Success',
                                 'Discount': DiscountP,
                                 'Total_Value' : request.session.get('total_order_value'),
                                 'shipping' : request.session.get('Shipping'),
                                 'savings': request.session.get('total_saving'),
                                 })
        except Coupon_Codes.DoesNotExist:
            return JsonResponse({'error': 'Invalid Coupon Code'})
    
    else:
        return JsonResponse({'error': 'Invalid Request'})


def checkout(request):
    user_cart_items = Cart_Items.objects.filter(Email=request.session.get('mail'))

    total_MRP = 0
    total_SP = 0
    total_quantity = 0

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
            total_MRP += int(product.marked_price) * item.Quantity
            total_SP += int(product.selling_price) * item.Quantity
            total_quantity += item.Quantity

    total_DP = total_MRP - total_SP
    Shipping = 100
    
    

    Total_CP= total_MRP - total_DP 

    Total_Value_after_discount = Total_CP + Shipping
    Total_Saving = total_MRP - Total_CP
    
    request.session['Shipping'] = Shipping
    request.session['total_order_value'] = Total_Value_after_discount
    request.session['total_saving'] = Total_Saving


    return render(request, 'checkout.html' , {'total_MRP': total_MRP, 
                                              'total_DP': total_DP,
                                              'Shippping': Shipping,
                                              'total_order_value' : Total_Value_after_discount,
                                              'Total_Savings': Total_Saving,
                                              'Cart_quantity': total_quantity
                                              })



def save_address(request):
    if request.method == 'POST':
        try:
            
            data = json.loads(request.body.decode('utf-8'))

            
            email = request.session.get('mail')
            if not email:
                return JsonResponse({'error': 'User email not found in session'}, status=400)

            user = get_object_or_404(Registered_Users, Email=email)

            # Create new address record
            User_Addresses.objects.create(
                Email=user,  # ForeignKey field
                full_name=data.get('full_name'),
                phone=data.get('phone'),
                building=data.get('building'),
                area=data.get('area'),
                landmark=data.get('landmark', ''),
                pincode=data.get('pincode'),
                town=data.get('town'),
                state=data.get('state')
            )

            return JsonResponse({'message': 'Address created successfully'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)