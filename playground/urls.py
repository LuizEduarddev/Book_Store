from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.create_user),
    path('auth/login/', views.login_user),
    path('auth/register/staff/', views.create_super_user),
    path('livros/alterar/', views.update_livro),
    path('livros/deletar/', views.deletar_livro),
    path('livros/get-all/', views.get_all_livros),
    path('livros/get/', views.get_livros_usuarios),
    path('livros/get-by-categoria/', views.get_livro_by_categoria),
    path('livros/get-by-id/', views.get_livro_by_id),
    path('livros/categorias/', views.get_categorias),
    path('pedidos/adicionar/', views.criar_pedido),
    path('pedidos/get-all/', views.get_all_pedido),
    path('pedidos/get-by-user/', views.get_pedido_by_user),
]