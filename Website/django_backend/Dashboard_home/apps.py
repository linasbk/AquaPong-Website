from django.apps import AppConfig


class DashboardHomeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Dashboard_home'

# apps.py or __init__.py

# default_app_config = 'Da.apps.YourAppNameConfig'  # Replace 'your_app_name' and 'YourAppNameConfig' with your actual app name and configuration class.

# # Import your signal handler function to ensure it's registered
# import your_app_name.signals
