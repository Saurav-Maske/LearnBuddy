from django.db import models
from django.conf import settings
from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager, PermissionsMixin)
from django.core.validators import RegexValidator,validate_email

# Create your models here.



class UserManager(BaseUserManager):

    def create_user(self,email,password=None):
        if not email:
            raise ValueError("Email is required")
        user=self.model(email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user 
    
    def create_superuser(self,email,password):
        user=self.create_user(email,password)
        user.is_active=True
        user.is_staff=True
        user.is_superuser=True
        user.save(using=self._db)
        return user
    
class UserModel(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True,max_length=255,validators=[validate_email],null=False,blank=False)
    otp=models.CharField(max_length=6, blank=True, null=True)
    otp_expiry=models.DateTimeField(blank=True,null=True)
    max_otp_try=models.CharField(max_length=2,default=settings.MAX_OTP_TRY)
    otp_max_out=models.DateTimeField(blank=True,null=True)
    score = models.IntegerField(default=0)

    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    user_register_date = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'

    objects=UserManager()

    def __str__(self):
        return self.email