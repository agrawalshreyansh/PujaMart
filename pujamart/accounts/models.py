from django.db import models

class Registered_Users(models.Model):
    First_Name = models.CharField(max_length=50)
    Last_Name = models.CharField(max_length=50)
    Email = models.EmailField(unique=True)
    Phone_Number = models.IntegerField(unique=True)
    Recieve_ADs = models.BooleanField()
    refresh_token = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return self.First_Name