from django.db import models
from accounts.models import Registered_Users

class Coupon_Codes(models.Model):
    Codes = models.CharField(max_length=100)
    Discount = models.IntegerField(null=True,blank=True)
    Max_Amount_Discount = models.IntegerField(null=True, blank=True)
    Amount = models.IntegerField(null=True, blank=True)


class User_Addresses(models.Model):
    Email = models.ForeignKey(Registered_Users, to_field='Email',  on_delete=models.CASCADE, related_name='addresses')
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    building = models.CharField(max_length=255)
    area = models.CharField(max_length=255)
    landmark = models.CharField(max_length=255, blank=True, null=True)
    pincode = models.CharField(max_length=10)
    town = models.CharField(max_length=255)
    state = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.full_name} - {self.pincode}"
