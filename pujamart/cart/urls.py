from django.urls import path
from . import views

urlpatterns = [
    path('', views.cart, name="cart" ),
    path('add-items', views.rec_cart_data, name='Add to Cart'),
    path('delete_item', views.delete_cart_items, name='Delete Cart Item')
]