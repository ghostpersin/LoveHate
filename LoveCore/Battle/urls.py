from django.urls import path
from .views import bot_response

urlpatterns = [
    path('bot/', bot_response, name='bot_response'),
]
