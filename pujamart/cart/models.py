from django.db import models
from accounts.models import Registered_Users

class Cart_Items(models.Model):
    Email = models.ForeignKey(Registered_Users, to_field='Email', related_name='cart_items' , on_delete=models.CASCADE)
    ProductID = models.CharField(max_length=200) 
    Quantity = models.IntegerField()
    
