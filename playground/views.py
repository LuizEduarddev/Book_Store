import json
from django.core import serializers
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from .models import Produto, Pedido, PedidoProduto

@csrf_exempt
def create_user(request):
    try:
        username = request.POST["username"]
        password = request.POST["password"]
        user = User.objects.create_user(username=username, password=password)
        user.save()
        return HttpResponse(f'Usuário criado com sucesso')
    except Exception as e:
        return HttpResponse(f'Erro ao tentar criar o usuário {e}')

@csrf_exempt
def login_user(request):
    username = request.POST["username"]
    password = request.POST["password"]
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponse('Login efetuado com sucesso.');
    else:
        return HttpResponse('Email ou senha incorretos.')
    

@csrf_exempt
def get_all_produtos(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                produtos = Produto.objects.values('nome', 'preco', 'estoque')
                return JsonResponse(list(produtos), safe=False) 
            except Exception as e:
                return HttpResponse('Falha ao tentar buscar os produtos')
        else:
            return HttpResponse('Usuário não autenticado.', status=403)
    else:
        return HttpResponse('Método não suportado.', status=405)

@csrf_exempt
def create_produto(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                nome_produto = request.POST["nome_produto"]
                preco_produto = request.POST["preco_produto"]
                estoque_produto = request.POST["quantidade_estoque"]
                p = Produto(nome=nome_produto, preco=preco_produto, estoque=estoque_produto)
                p.save()
                return HttpResponse(f'Produto {nome_produto} cadastrado com sucesso.')
            except Exception as e:
                return HttpResponse(f'Falha ao tentar cadastrar o produto: {e}')
        else:
            return HttpResponse('Usuário não autenticado.', status=403) 
    else:
        return HttpResponse('Método não permitido. Use POST.', status=405) 
    
@csrf_exempt
def update_produto(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                id_produto = request.POST["id_produto"]
                new_produto = Produto.objects.get(id=id_produto)
                nome_produto = request.POST["nome_produto"]
                preco_produto = request.POST["preco_produto"]
                estoque_produto = request.POST["quantidade_estoque"]
                new_produto.nome = nome_produto
                new_produto.preco = preco_produto
                new_produto.estoque = estoque_produto
                new_produto.save()
                return HttpResponse(f'Produto {nome_produto} alterado com sucesso.')
            except Exception as e:
                return HttpResponse(f'Falha ao tentar alterar o produto: {e}')
        else:
            return HttpResponse('Usuário não autenticado.', status=403) 
    else:
        return HttpResponse('Método não suportado.', status=405) 
    
@csrf_exempt
def deletar_produto(request):
    if request.method == 'DELETE':
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
                id_produto = data.get("id_produto")
                produto = Produto.objects.get(id=id_produto)
                produto.delete()
                return HttpResponse('Produto deletado com sucesso')
            except Exception as e:
                return HttpResponse('Falha ao tentar deletar o produto.')

from django.db import transaction

@csrf_exempt
def criar_pedido(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
                nome_cliente = data.get("nome_cliente")
                products_info = data.get("produtos")
                total = 0

                with transaction.atomic():
                    pedido = Pedido(valor_total=0, nome_cliente=nome_cliente)
                    pedido.save()

                    for item in products_info:
                        id_produto = item.get('id_produto')
                        quantidade = item.get('quantidade')
                        produto = Produto.objects.get(id=id_produto)

                        check_estoque = produto.estoque - quantidade
                        if check_estoque < 0:
                            return HttpResponse(f'{produto.nome} não possui estoque suficiente', status=400)

                        produto.estoque = check_estoque
                        produto.save()
                        produto_total = produto.preco * quantidade
                        total += produto_total

                        pedido_produto = PedidoProduto(pedido=pedido, produto=produto)
                        pedido_produto.save()

                    pedido.valor_total = total
                    pedido.save()

                return HttpResponse('Pedido criado com sucesso')
            except Exception as e:
                return HttpResponse(f'Falha ao tentar criar o pedido. {e}', status=400)
        else:
            return HttpResponse('Usuário não autenticado.', status=403)
    else:
        return HttpResponse('Método não suportado.', status=405)

    
@csrf_exempt
def get_all_pedido(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                produtos = Produto.objects.values('nome', 'preco', 'estoque')
                return JsonResponse(list(produtos), safe=False) 
            except Exception as e:
                return HttpResponse('Falha ao tentar buscar os produtos')
        else:
            return HttpResponse('Usuário não autenticado.', status=403)
    else:
        return HttpResponse('Método não suportado.', status=405)