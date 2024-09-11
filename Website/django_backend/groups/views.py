from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from Dashboard_home.models import User
from .models import Group

@api_view(['POST'])
@permission_classes([AllowAny])
def check_user_joined(request):
    my_userID = request.data.get('my_userID')
    
    if not my_userID:
        return JsonResponse({"error": "my_userID is required"}, status=400)
    
    try:
        my_userID = int(my_userID)  
    except ValueError:
        return JsonResponse({"error": "Invalid my_userID format"}, status=400)
    
    try:
        me = User.objects.get(userID=my_userID)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    
    try:
        result = Group.objects.filter(users=me).exists()
        return JsonResponse({"result": result})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)