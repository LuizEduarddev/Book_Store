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
    path('livros/get-by-nome/', views.get_livro_by_nome),
    path('livros/categorias/', views.get_categorias),
    path('livros/vendidos/', views.get_all_sales_data),
    path('livros/vendidos/detalhes', views.get_book_order_data),
    path('pedidos/adicionar/', views.criar_pedido),
    path('pedidos/get-all/', views.get_all_pedido),
    path('pedidos/get-by-user/', views.get_pedido_by_user),
    path('pedidos/get-by-id/', views.get_pedido_by_id),
]