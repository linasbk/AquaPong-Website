from rest_framework import serializers
from .models import User
from django.core.validators import validate_email
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator, validate_email

class UserSerializer(serializers.ModelSerializer):
    gender = serializers.ChoiceField(choices=['Male', 'Female'])

    class Meta:
        model = User
        fields = ['username', 'email', 'gender', 'otp_enabled', 'otp_verified', 'qr_code', 'profile_image', 'status', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_username(self, value):
        if len(value) > 16:
            raise serializers.ValidationError("Username must be at most 16 characters long.")
        RegexValidator(
            regex=r'^[\w.@+-]+$',
            message='Enter a valid username'
        )(value)
        if not value[0].isalpha():
            raise serializers.ValidationError("Username must start with a letter.")
        return value

    def validate_email(self, value):
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Invalid email address.")
        return value

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(' '.join(e.messages))
        return value

    def create(self, validated_data):
        gender_str = validated_data.pop('gender')
        gender = gender_str == 'Female'
        profile_image = 'profiles/female.png' if gender else 'profiles/male.png'
        user = User(
            fullName=validated_data['username'],
            username=validated_data['username'],
            email=validated_data['email'],
            gender=gender,
            profile_image=profile_image,
        )

        user.set_password(validated_data['password'])
        user.save()
        return user