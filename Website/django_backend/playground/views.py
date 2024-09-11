from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse


def game(request) :
    return HttpResponse("HELLO FROM GAME");