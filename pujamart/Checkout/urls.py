from django.urls import path
from . import views

urlpatterns = [
    path('', views.checkout, name='checkout'),
    path('check_code/', views.coupons, name ='Coupon Validation'),
    path('save_address/', views.save_address, name='save_address'),
]
