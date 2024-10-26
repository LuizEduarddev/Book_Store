from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/<str:username>/<str:password>/', views.create_user),
    path('auth/login/', views.login_user),
    path('produtos/cadastrar/', views.create_produto),
    path('produtos/alterar/', views.update_produto),
    path('produtos/deletar/', views.deletar_produto),
    path('produtos/get-all/', views.get_all_produtos),
    path('pedidos/adicionar/', views.criar_pedido),
]