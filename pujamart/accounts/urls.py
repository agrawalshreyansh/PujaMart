from django.urls import path
from . import views

urlpatterns = [
    path('register', views.register, name="register" ),
    path('login', views.user_login, name='Login'),
    path('user_register/', views.user_register, name='user_register'),
    path('user_logged_in/', views.user_creation, name='user_logged_in'),
    path('user_login/', views.user_login, name='UserLogin'),
    path('refresh-token/', views.refresh_token_view, name='refresh_token'),
]