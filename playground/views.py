import json
from django.core import serializers
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from .models import Pedidos, Livros, PedidoLivro
from django.db import transaction
from .utils.Categories import CATEGORIES

@csrf_exempt
def create_user(request):
    try:
        username = request.POST["username"]
        password = request.POST["password"]
        user = User.objects.create_user(username=username, password=password)
        user.save()
        return HttpResponse(status=200)
    except Exception as e:
        return HttpResponse(f"{e}",status=500)

@csrf_exempt
def login_user(request):
    username = request.POST["username"]
    password = request.POST["password"]
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        request.session.save()
        return HttpResponse("",status=200)
    else:
        return HttpResponse("Username or password incorrect",status=500)

@csrf_exempt
def create_livro(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                nome_livro = request.POST["nome_livro"]
                preco_livro = request.POST["preco_livro"]
                estoque_livro = request.POST["quantidade_estoque"]
                isbn_livro = request.POST["isbn_livro"]
                categoria = request.POST["categoria"]
                nome_autor = request.POST["nome_autor"]
                data_lancamento = request.POST["data_lancamento"]

                p = Livros(nome=nome_livro, preco=preco_livro, estoque=estoque_livro, isbn=isbn_livro,
                           categoria=categoria, nome_autor=nome_autor, data_lancamento=data_lancamento)
                p.save()
                return HttpResponse(status=200)
            except Exception as e:
                return HttpResponse(f'Falha ao tentar cadastrar o produto: {e}', status=400)
        else:
            return HttpResponse('Usuário não autenticado.', status=403)
    else:
        return HttpResponse('Método não permitido. Use POST.', status=405)

@csrf_exempt
def get_all_livros(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                livros = Livros.objects.values('nome', 'preco', 'estoque', 'isbn', 'categoria', 'nome_autor', 'data_lancamento')
                return JsonResponse(list(livros), safe=False) 
            except Exception as e:
                return HttpResponse('Falha ao tentar buscar os pedidos')
        else:
            return HttpResponse('Usuário não autenticado.', status=403)
    else:
        return HttpResponse('Método não suportado.', status=405)

@csrf_exempt
def get_livros_usuarios(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                livros = Livros.objects.values('id','nome', 'preco', 'estoque', 'isbn', 'categoria', 'nome_autor', 'data_lancamento')
                filtered_livros = list(filter(lambda livro: livro.estoque >= 1, livros))
                if len(filtered_livros) > 0:
                    return JsonResponse(list(livros), safe=False, status=200)
                else:
                    return HttpResponse(status=204)
            except Exception as e:
                return HttpResponse(f'Erro: {e}', status=400)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=405)

@csrf_exempt
def get_livro_by_categoria(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                body = json.loads(request.body)
                categoria_nome = body.get('categoria')
                CATEGORY_DICT = dict(CATEGORIES)
                categoria_db = None
                for key, value in CATEGORY_DICT.items():
                    if value == categoria_nome:
                        categoria_db = key
                        break

                if categoria_db is None:
                    return HttpResponse('Categoria não encontrada.', status=404)

                livros = Livros.objects.filter(categoria=categoria_db)

                livros_data = [
                    {
                        'id': str(livro.id),
                        'nome': livro.nome,
                        'preco': str(livro.preco),
                        'estoque': livro.estoque,
                        'isbn': livro.isbn,
                        'nome_autor': livro.nome_autor,
                        'data_lancamento': livro.data_lancamento,
                    }
                    for livro in livros
                ]
                return JsonResponse(livros_data, safe=False, status=200)
            except Exception as e:
                return HttpResponse(f'Falha ao tentar buscar os livros: {e}', status=400)
        else:
            return HttpResponse('Usuário não autenticado.', status=403)
    else:
        return HttpResponse('Método não suportado.', status=405)

@csrf_exempt
def update_livro(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                id_livro = request.POST["id_livro"]
                new_livro = Livros.objects.get(id=id_livro)
                nome_livro = request.POST["nome_livro"]
                preco_livro = request.POST["preco_livro"]
                estoque_livro = request.POST["estoque_livro"]
                isbn = request.POST["isbn"]
                categoria_nome = request.POST["categoria"]
                new_livro.nome = nome_livro
                new_livro.preco = preco_livro
                new_livro.estoque = estoque_livro
                new_livro.isbn = isbn
                new_livro.categoria = categoria_nome
                new_livro.save()
                return HttpResponse(status=200)
            except Exception as e:
                return HttpResponse(f'Falha ao tentar alterar o livro: {e}', status=400)
        else:
            return HttpResponse('Usuário não autenticado.', status=403)
    else:
        return HttpResponse('Método não suportado.', status=405)
    
@csrf_exempt
def deletar_livro(request):
    if request.method == 'DELETE':
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
                id_livro = data.get("id_livro")
                livro = Livros.objects.get(id=id_livro)
                livro.delete()
                return HttpResponse(status=200)
            except Exception as e:
                return HttpResponse(f'Falha ao tentar deletar o livro. {e}')


@csrf_exempt
def criar_pedido(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                data = json.loads(request.body)
                nome_cliente = data.get("nome_cliente")
                livros_info = data.get("livros")
                total = 0

                with transaction.atomic():
                    pedido = Pedidos(valor_total=0, nome_cliente=nome_cliente)
                    pedido.save()

                    for item in livros_info:
                        id_livros = item.get('id_livros')
                        quantidade = item.get('quantidade')
                        livro = Livros.objects.get(id=id_livros)

                        check_estoque = livro.estoque - quantidade
                        if check_estoque < 0:
                            return HttpResponse(f'{livro.nome} não possui estoque suficiente', status=400)

                        livro.estoque = check_estoque
                        livro.save()
                        livro_total = livro.preco * quantidade
                        total += livro_total

                        pedido_livro = PedidoLivro(pedido=pedido, livro=livro)
                        pedido_livro.save()

                    pedido.valor_total = total
                    pedido.save()

                return HttpResponse('Pedido criado com sucesso', status=200)
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
                pedidos = Pedidos.objects.all()
                pedidos_list = []
                
                for pedido in pedidos:
                    pedido_dict = {
                        'id': pedido.id,
                        'nome_cliente': pedido.nome_cliente,
                        'valor_total': str(pedido.valor_total), 
                        'livros': [livro.id for livro in pedido.livros.all()] 
                    }
                    pedidos_list.append(pedido_dict)
                
                return JsonResponse(pedidos_list) 
            except Exception as e:
                return HttpResponse(f'Falha ao tentar buscar os pedidos {e}')
        else:
            return HttpResponse('Usuário não autenticado.', status=403)
    else:
        return HttpResponse('Método não suportado.', status=405)
    
@csrf_exempt
def get_categorias(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                categorias = [label for _, label in CATEGORIES] 
                return JsonResponse(list(categorias), safe=False, status=200)
            except Exception as e:
                return HttpResponse(f'Falha ao tentar buscar as categoria {e}')
        else:
            return HttpResponse('Usuário não autenticado.', status=403)
    else:
        return HttpResponse('Método não suportado.', status=405)