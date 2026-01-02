from datetime import datetime, timedelta
from rest_framework import serializers
import random
from .models import UserModel
from django.conf import settings



class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True, max_length=255)
    password1=serializers.CharField(write_only=True,
                                     required=True,
                                    min_length=settings.MIN_PASSWORD_LENGTH, 
                                    error_messages={
                                        'min_length': f'Password must be at least {settings.MIN_PASSWORD_LENGTH} characters long.'
                                    })
    password2=serializers.CharField(write_only=True,
                                     required=True, 
                                     min_length=settings.MIN_PASSWORD_LENGTH,
                                    error_messages={
                                        'min_length': f'Password must be at least {settings.MIN_PASSWORD_LENGTH} characters long.'
                                    })
    
    class Meta:
        model=UserModel
        fields=['name',
                'email',
                'password1',
                'password2']
        

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
    
    def create(self, validated_data):
        otp=random.randint(100000, 999999)
        otp_expiry=datetime.now() + timedelta(minutes=10)
        user = UserModel(
            name=validated_data['name'],
            email=validated_data['email'],
            otp=otp,
            otp_expiry=otp_expiry,
            max_otp_try=settings.MAX_OTP_TRY,
            is_active=False
        )
        user.set_password(validated_data['password1'])
        user.save()
        return user