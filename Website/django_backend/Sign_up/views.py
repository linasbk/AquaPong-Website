from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import  AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from .serializers import UserSerializer
from Dashboard_home.models import Leaderbord
import requests
import pyotp
import qrcode
from io import BytesIO
from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken, TokenError
import jwt
from django.utils import timezone
User = get_user_model()
import os

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    refresh_token = request.COOKIES.get('refresh_token')
    old_access_token = request.COOKIES.get('access_token')

    if not refresh_token or not old_access_token:
        return Response({'error': 'Both refresh and access tokens are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        unverified_payload = jwt.decode(old_access_token, options={"verify_signature": False})
        if unverified_payload['exp'] < timezone.now().timestamp():
            try:
                valid_token = RefreshToken(refresh_token)
                user = User.objects.filter(userID=valid_token['user_id']).first()
                new_access_token = valid_token.access_token
                new_refresh_token = RefreshToken.for_user(user)
                valid_token.blacklist()
                response = JsonResponse({
                    'success': 'Token refreshed successfully',
                })
                response.set_cookie(
                    'access_token',
                    str(new_access_token),
                    httponly=True,
                    samesite='Lax'
                )
                response.set_cookie(
                    'refresh_token',
                    str(new_refresh_token),
                    httponly=True,
                    samesite='Lax'
                )
                return response
            except TokenError:
                return Response({'error': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                AccessToken(old_access_token)
                return Response({'message': 'Access token is still valid'}, status=status.HTTP_200_OK)
            except TokenError:
                return Response({'error': 'Invalid access token'}, status=status.HTTP_400_BAD_REQUEST)
    except jwt.DecodeError:
        return Response({'error': 'Malformed access token'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def Sign_up(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        Leaderbord.objects.create(userID=user)
        return Response({
            'success': True,
            'message': 'User created successfully',
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@permission_classes([AllowAny])
def Sign_in(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    otp = data.get('otp')

    user = User.objects.filter(username=username).first()
    if not user:
        return Response({'error': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)
    if user.otp_verified:
        if not otp:
            return Response({'message': 'OTP required', 'otp_required': True}, status=status.HTTP_200_OK)   
        totp = pyotp.TOTP(user.otp_base32)
        if not totp.verify(otp):
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=password)
    if user is not None:
        is_first_login = user.firstlogin
        if user.firstlogin:
            user.firstlogin = False
            user.save()
        access_token = AccessToken.for_user(user)
        refresh_token = RefreshToken.for_user(user)
        
        # Set the token in cookies
        response = JsonResponse({
            'success': 'User logged in successfully',
            'otp_verified': user.otp_verified,
            'firstlogin': is_first_login,
        })
        response.set_cookie(
            'access_token',
            str(access_token),
            httponly=True,
            samesite='Lax'
        )
        response.set_cookie(
            'refresh_token',
            str(refresh_token),
            httponly=True,
            samesite='Lax'
        )
        return response
    return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def Sign_out(request):
    response = JsonResponse({
        'success': 'User logged out successfully',
    })
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response


@api_view(['GET'])
def check_auth(request):
    check_refresh_token = request.COOKIES.get('refresh_token')
    if not check_refresh_token:
        return Response({'error': 'Refresh token not found'}, status=status.HTTP_401_UNAUTHORIZED)
    user = User.objects.filter(userID=request.user.userID).first()
    profile_image = user.profile_image.url if user.profile_image else None
    return Response({
        'success': True,
        'user': {
            'id': user.userID,
            'username': user.username,
            'email': user.email,
            'fullName': user.fullName,
            'image': profile_image,
            'otp_enabled': user.otp_enabled,
            'otp_verified': user.otp_verified,
            'firstlogin': user.firstlogin,
            'qr_code': user.qr_code.url if user.qr_code else None,
        }
    }, status=status.HTTP_200_OK)

@csrf_exempt
def download_and_save_image(url, user):
    response = requests.get(url)
    if response.status_code != requests.codes.ok:
        return None
    img_temp = NamedTemporaryFile(delete=True)
    img_temp.write(response.content)
    img_temp.flush()
    file_name = f"profile_image_{user.userID}.jpg"
    user.profile_image.save(file_name, File(img_temp), save=True)
    return user.profile_image.url

def find_in_layers(data, key):
    if isinstance(data, dict):
        if key in data:
            return data[key]
        for value in data.values():
            result = find_in_layers(value, key)
            if result is not None:
                return result
    elif isinstance(data, list):
        for item in data:
            result = find_in_layers(item, key)
            if result is not None:
                return result
    return None


@api_view(['POST'])
@permission_classes([AllowAny])
def callback(request):
    code = request.data.get('code')
    otp = request.data.get('otp')
    username = request.data.get('username')
    if not code and not (otp and username):
        return JsonResponse({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)

    if code:
        try:
            if not otp and not username:
                data = {
                    'grant_type': 'authorization_code',
                    'client_id': settings.CLIENT_ID,
                    'client_secret': settings.CLIENT_SECRET,
                    'code': code,
                    'redirect_uri': settings.REDIRECT_URI
                }

                response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
                access_token = response.json().get('access_token')
                if not access_token:
                    return JsonResponse({'error': 'No access token in response'}, status=status.HTTP_403_FORBIDDEN)

                response = requests.get('https://api.intra.42.fr/v2/me', headers={
                    'Authorization': f'Bearer {access_token}'
                }).json()
                if 'error' in response:
                    return JsonResponse({'error': response['error']}, status=403)

                username = find_in_layers(response, 'login')
                intralogin = find_in_layers(response, 'login')
                email = find_in_layers(response, 'email')
                fullName = find_in_layers(response, 'displayname')
                image = find_in_layers(response, 'image') 
                profile_image_url = image.get('versions', {}).get('medium') if isinstance(image, dict) else None
                if not all([username, email, fullName, profile_image_url, intralogin]):
                    missing_fields = [field for field, value in [('username', username), ('email', email), 
                              ('fullName', fullName), ('profile_image_url', profile_image_url)] if not value]
                    return JsonResponse({'error': f'Missing required fields: {", ".join(missing_fields)}'}, status=400)
            user, created = User.objects.get_or_create(intralogin=intralogin)
            if created:
                user.email = email
                user.fullName = fullName
                user.intralogin = intralogin
                user.username = username
                profile_image = download_and_save_image(profile_image_url, user)
                if profile_image:
                    user.save()
                Leaderbord.objects.create(userID=user)
                user_status = 'created'
            else:

                user.firstlogin = False
                user.save()
                user_status = 'exist'

            if user.otp_verified:
                return JsonResponse({
                    'message': 'OTP required',
                    'otp_required': True,
                    'username': username
                }, status=status.HTTP_200_OK)

            return login_user(user, user_status)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    elif otp and username:
        user = User.objects.filter(username=username).first()
        if not user:
            return JsonResponse({'error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not user.otp_verified:
            return JsonResponse({'error': 'OTP not required for this user'}, status=status.HTTP_400_BAD_REQUEST)
        
        totp = pyotp.TOTP(user.otp_base32)
        if not totp.verify(otp):
            return JsonResponse({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
        
        return login_user(user, 'exist')
    return JsonResponse({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([AllowAny])
def login_user(user, user_status):
    access_token = AccessToken.for_user(user)
    refresh_token = RefreshToken.for_user(user)
    response = JsonResponse({
        "success": "User logged in successfully",
        "otp_verified": user.otp_verified,
        "user_status": user_status,
        "firstlogin": user.firstlogin,
    })
    response.set_cookie(
        'access_token',
        str(access_token),
        httponly=True,
        samesite='Lax'
    )
    response.set_cookie(
        'refresh_token',
        str(refresh_token),
        httponly=True,
        samesite='Lax'
    )
    return response
@api_view(['POST'])
def set_password(request):
    data = request.data
    password = data.get('password')
    user = User.objects.filter(userID=request.user.userID).first()
    try:
        validate_password(password)
    except ValidationError as e:
        return Response({'error': ' '.join(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(password)
    user.save()
    return Response({'success': True, 'message': 'Password set successfully'}, status=status.HTTP_200_OK)
from playground.models import Game
@api_view(['POST'])
def delete_user(request):
    try:
        user = User.objects.get(userID=request.user.userID)
        Leaderbord.objects.filter(userID=user.userID).delete()
        Game.objects.filter(
            first_player=user
        ).update(first_player=None)
        Game.objects.filter(
            second_player=user
        ).update(second_player=None)
        Game.objects.filter(
            winner=user
        ).update(winner=None)
        
        user.delete()
        response = Response({'success': True, 'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
        response.delete_cookie('refresh_token')
        
        return response
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def generateOTP(request):
    data = request.data
    password = data.get('password')
    user = User.objects.filter(userID=request.user.userID).first()
    if not user.check_password(password):
        return Response({'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)
    otp_base32 = pyotp.random_base32()
    otp_auth_url = pyotp.totp.TOTP(otp_base32).provisioning_uri(name=user.username, issuer_name='Aquapong')
    stream = BytesIO()
    qr = qrcode.make(f"{otp_auth_url}")
    qr.save(stream, "PNG")
    user.otp_base32 = otp_base32
    user.otp_auth_url = otp_auth_url
    user.qr_code.save(f"qr_code_{user.userID}.png", File(stream), save=True)
    user.save()
    serializer = UserSerializer(user)
    return Response({'success': True, 'user': serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST'])
def verifyOTP(request):
    user = User.objects.filter(userID=request.user.userID).first()
    data = request.data
    totp = pyotp.TOTP(user.otp_base32)
    if totp.verify(data.get('otp')):
        user.otp_enabled = True
        user.otp_verified = True
        user.save()
        serializer = UserSerializer(user)
        return Response({'success': True, 'user': serializer.data}, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def disableOTP(request):
    data = request.data
    password = data.get('password')
    user = User.objects.filter(userID=request.user.userID).first()
    if not user.check_password(password):
        return Response({'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)
    user.otp_enabled = False
    user.otp_verified = False
    user.otp_base32 = None
    user.otp_auth_url = None
    user.save()
    serializer = UserSerializer(user)
    return Response({'success': True, 'user': serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST'])
def changePassword(request):
    data = request.data
    new_password = data.get('newPassword')
    old_password = data.get('oldPassword')
    user = User.objects.filter(userID=request.user.userID).first()
    if not user.check_password(old_password):
        return Response({'error': 'Invalid old password'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        validate_password(new_password)
        if old_password == new_password:
            return JsonResponse({'error': 'New password cannot be the same as old password'}, status=status.HTTP_400_BAD_REQUEST)
    except ValidationError as e:
        return Response({'error': ' '.join(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(new_password)
    user.save()
    return Response({'success': True, 'message': 'Password changed successfully'}, status=status.HTTP_200_OK)