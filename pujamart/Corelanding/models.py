# models.py
from django.db import models

class BestSellers(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    marked_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='Best_Sellers/')  # Specify the upload directory

    def __str__(self):
        return self.name

class FeaturedProducts(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    marked_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='Featured Products/')  # Specify the upload directory

    def __str__(self):
        return self.name


