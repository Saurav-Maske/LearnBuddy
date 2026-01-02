from datetime import datetime, timedelta
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth import authenticate
from django.utils import timezone

from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserModel
from .serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        """Signup endpoint - creates user and sends OTP"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Send OTP via email
            try:
                print(f"Sending OTP {user.otp} to {user.email}")  # Debug log
                send_mail(
                    'LearnBuddy - Your OTP Code',
                    f'Your OTP code is: {user.otp}\n\nThis code will expire in 10 minutes.',
                    settings.EMAIL_HOST_USER,
                    [user.email],
                    fail_silently=False,
                )
                print("Email sent successfully!")  # Debug log
                return Response({
                    'message': 'User created successfully. OTP sent to your email.',
                    'email': user.email
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(f"Email error: {str(e)}")  # Debug log
                user.delete()  # Rollback if email fails
                return Response({
                    'error': f'Failed to send OTP email: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def verify_otp(self, request):
        """Verify OTP and activate account"""
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response({
                'error': 'Email and OTP are required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return Response({
                'error': 'User not found.'
            }, status=status.HTTP_404_NOT_FOUND)

        if user.is_active:
            return Response({
                'error': 'Account already activated.'
            }, status=status.HTTP_400_BAD_REQUEST)

        if user.otp_expiry and timezone.now() > user.otp_expiry:
            return Response({
                'error': 'OTP has expired. Please request a new one.'
            }, status=status.HTTP_400_BAD_REQUEST)

        if user.otp == str(otp):
            user.is_active = True
            user.otp = None
            user.otp_expiry = None
            user.save()
            
            return Response({
                'message': 'Account verified successfully. You can now login.'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': 'Invalid OTP.'
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def resend_otp(self, request):
        """Resend OTP to user email"""
        email = request.data.get('email')

        if not email:
            return Response({
                'error': 'Email is required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return Response({
                'error': 'User not found.'
            }, status=status.HTTP_404_NOT_FOUND)

        if user.is_active:
            return Response({
                'error': 'Account already activated.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Generate new OTP
        import random
        user.otp = str(random.randint(100000, 999999))
        user.otp_expiry = timezone.now() + timedelta(minutes=10)
        user.save()

        # Send OTP via email
        try:
            send_mail(
                'LearnBuddy - Your New OTP Code',
                f'Your new OTP code is: {user.otp}\n\nThis code will expire in 10 minutes.',
                settings.EMAIL_HOST_USER,
                [user.email],
                fail_silently=False,
            )
            return Response({
                'message': 'New OTP sent to your email.'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': 'Failed to send OTP email. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login endpoint - returns JWT tokens"""
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({
            'error': 'Email and password are required.'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = UserModel.objects.get(email=email)
    except UserModel.DoesNotExist:
        return Response({
            'error': 'Invalid credentials.'
        }, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_active:
        return Response({
            'error': 'Account not verified. Please verify your OTP first.'
        }, status=status.HTTP_403_FORBIDDEN)

    if user.check_password(password):
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login successful.',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'name': user.name,
                'email': user.email,
                'score': user.score
            }
        }, status=status.HTTP_200_OK)
    
    return Response({
        'error': 'Invalid credentials.'
    }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get current user profile"""
    user = request.user
    return Response({
        'name': user.name,
        'email': user.email,
        'score': user.score,
        'user_register_date': user.user_register_date
    }, status=status.HTTP_200_OK)