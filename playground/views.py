import json
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from .models import Pedidos, Livros, PedidoLivro
from django.db import transaction
from .utils.Categories import CATEGORIES
from django.forms.models import model_to_dict
from datetime import datetime
from django.db.models import Sum


@csrf_exempt
def create_user(request):
    try:
        username = request.POST["username"]
        password = request.POST["password"]

        user = User.objects.create_user(username=username, password=password)

        user.save()

        return HttpResponse(status=200)
    except Exception as e:
        return HttpResponse(f"Error: {e}", status=500)
    
@csrf_exempt
def create_super_user(request):
    if request.user.is_authenticated and request.user.is_staff == True:
        try:
            username = request.POST["username"]
            password = request.POST["password"]

            user = User.objects.create_superuser(username=username, password=password)
            user.save()

            return HttpResponse(status=200)
        except Exception as e:
            return HttpResponse(f"{e}",status=500)
    else:
        return HttpResponse(status=400)


@csrf_exempt
def login_user(request):
    username = request.POST["username"]
    password = request.POST["password"]
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        request.session.save()
        return HttpResponse(user.is_staff,status=200)
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
                foto_livro = request.FILES.get("foto_livro")

                CATEGORY_DICT = dict(CATEGORIES)
                categoria_db = None
                for key, value in CATEGORY_DICT.items():
                    if value == categoria:
                        categoria_db = key
                        break

                if categoria_db is None:
                    return HttpResponse('Categoria não encontrada.', status=404)

                p = Livros(
                    nome=nome_livro,
                    preco=preco_livro,
                    estoque=estoque_livro,
                    isbn=isbn_livro,
                    categoria=categoria_db,
                    nome_autor=nome_autor,
                    data_lancamento=data_lancamento,
                    foto_livro = foto_livro
                )
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
                livros = Livros.objects.all()
                livros_data = [
                    {
                        'id': str(livro.id),
                        'nome': livro.nome,
                        'preco': str(livro.preco),
                        'estoque': livro.estoque,
                        'isbn': livro.isbn,
                        'nome_autor': livro.nome_autor,
                        'data_lancamento': livro.data_lancamento,
                        'imagem': request.build_absolute_uri(livro.foto_livro.url) 
                    }
                    for livro in livros
                ]
                return JsonResponse(livros_data, safe=False, status=200)
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
def get_livro_by_id(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                body = json.loads(request.body)
                id = body.get('id')
                livro = Livros.objects.get(id=id)

                livro_data = model_to_dict(livro)
                
                livro_data['id'] = str(livro.id)
                
                if livro_data.get('foto_livro'):
                    livro_data['foto_livro'] = request.build_absolute_uri(livro_data['foto_livro'].url)

                for category_code, category_name in CATEGORIES:
                    if livro_data['categoria'] == category_code:
                        livro_data['categoria'] = category_name
                        break
                
                return JsonResponse(livro_data, status=200)
            except Livros.DoesNotExist:
                return HttpResponse('Livro não encontrado.', status=404)
            except Exception as e:
                return HttpResponse(f'Falha ao tentar buscar o livro: {e}', status=400)
        else:
            return HttpResponse('Usuário não autenticado.', status=403)
    else:
        return HttpResponse('Método não suportado.', status=405)

@csrf_exempt
def get_livro_by_nome(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                body = json.loads(request.body)
                nome_livro = body.get('nome')

                livros = Livros.objects.filter(nome__icontains = nome_livro)
                livros_data = [
                    {
                        'id': str(livro.id),
                        'nome': livro.nome,
                        'preco': str(livro.preco),
                        'estoque': livro.estoque,
                        'imagem': request.build_absolute_uri(livro.foto_livro.url) 
                    }
                    for livro in livros
                ]
                return JsonResponse(livros_data, safe=False, status=200)
            except Exception as e:
                print(e)
                return HttpResponse(status=400)
        else:
            return HttpResponse(status=403)
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

                livros = Livros.objects.filter(categoria=categoria_db, estoque__gt=0)

                livros_data = [
                    {
                        'id': str(livro.id),
                        'nome': livro.nome,
                        'preco': str(livro.preco),
                        'estoque': livro.estoque,
                        'isbn': livro.isbn,
                        'nome_autor': livro.nome_autor,
                        'data_lancamento': livro.data_lancamento,
                        'imagem': request.build_absolute_uri(livro.foto_livro.url) 
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
                data = json.loads(request.body)  # Parse JSON payload
                id_livro = data.get("id")
                nome_livro = data.get("nomeLivro")
                preco_livro = data.get("precoLivro")
                estoque_livro = data.get("estoqueLivro")
                isbn = data.get("isbn")
                categoria_nome = data.get("categoria")
                data_lancamento = data.get("dataLancamento")
                autor = data.get("autor")

                new_livro = Livros.objects.get(id=id_livro)

                CATEGORY_DICT = dict(CATEGORIES)
                categoria_db = None
                for key, value in CATEGORY_DICT.items():
                    if value == categoria_nome:
                        categoria_db = key
                        break

                if categoria_db is None:
                    return HttpResponse(status=406)

                new_livro.nome = nome_livro
                new_livro.preco = preco_livro
                new_livro.estoque = estoque_livro
                new_livro.isbn = isbn
                new_livro.categoria = categoria_db
                new_livro.data_lancamento = data_lancamento
                new_livro.nome_autor = autor
                new_livro.save()
                return HttpResponse(status=200)
            except Exception as e:
                print(e)
                return HttpResponse(status=400)
        else:
            return HttpResponse(status=403)
    else:
        return HttpResponse(status=405)
    
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
                livros_info = data.get("livros")
                total = 0

                current_date = datetime.now().strftime('%d/%m/%Y')
                current_time = datetime.now().strftime('%H:%M')

                with transaction.atomic():
                    pedido = Pedidos(
                        valor_total=0, 
                        user=request.user, 
                        data_pedido=current_date, 
                        hora_pedido=current_time
                    )
                    pedido.save()

                    try:
                        for item in livros_info:
                            id_livros = item.get('id_livros')
                            quantidade = item.get('quantidade')
                            livro = Livros.objects.get(id=id_livros)

                            check_estoque = livro.estoque - quantidade
                            if check_estoque < 0:
                                pedido.delete()
                                return HttpResponse('Estoque insuficiente para o livro.', status=401)

                            livro.estoque = check_estoque
                            livro.save()
                            livro_total = livro.preco * quantidade
                            total += livro_total

                            pedido_livro = PedidoLivro(pedido=pedido, livro=livro, quantidade=quantidade)
                            pedido_livro.save()

                        pedido.valor_total = total
                        pedido.save()

                    except Exception as e:
                        pedido.delete()
                        return HttpResponse(f'Erro ao processar pedido: {e}', status=400)

                return HttpResponse('Pedido criado com sucesso.', status=200)

            except Exception as e:
                return HttpResponse(f'Erro geral: {e}', status=400)
        else:
            return HttpResponse('Usuário não autenticado.', status=403)
    else:
        return HttpResponse('Método não suportado.', status=405)


@csrf_exempt
def get_all_pedido(request):
    if request.method == 'GET':
        if request.user.is_authenticated and (request.user.is_superuser or request.user.is_staff):
            try:
                pedidos = Pedidos.objects.all()
                pedidos_list = []
                
                for pedido in pedidos:
                    livros_details = [
                        {
                            'id': str(pedido_livro.livro.id),
                            'nome': pedido_livro.livro.nome,
                            'preco': float(pedido_livro.livro.preco),
                            'quantidade': pedido_livro.quantidade,
                            'imagemLivro':request.build_absolute_uri(pedido_livro.livro.foto_livro.url),
                            'categoria':pedido_livro.livro.categoria
                        }
                        for pedido_livro in PedidoLivro.objects.filter(pedido=pedido)
                    ]

                    pedidos_list.append({
                        'id': str(pedido.id),
                        'valorTotal': float(pedido.valor_total),
                        'dataPedido': pedido.data_pedido, 
                        'horaPedido': pedido.hora_pedido, 
                        'statusPedido': pedido.status_pedido,
                        'livros': livros_details,
                        'dataEntrega':pedido.data_pedido_entregue,
                        'enderecoSaida':pedido.endereco_saida,
                        'enderecoEntrega':pedido.endereco_entrega
                    })
                
                return JsonResponse(pedidos_list, safe=False) 
            except Exception as e:
                return HttpResponse(f'Falha ao tentar buscar os pedidos {e}')
        else:
            return HttpResponse('Usuário não autenticado.', status=403)
    else:
        return HttpResponse('Método não suportado.', status=405)
    
@csrf_exempt
def get_pedido_by_user(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                pedidos = Pedidos.objects.filter(user=request.user)
                pedidos_list = []

                for pedido in pedidos:
                    livros_details = [
                        {
                            'id': str(pedido_livro.livro.id),
                            'nome': pedido_livro.livro.nome,
                            'preco': float(pedido_livro.livro.preco),
                            'quantidade': pedido_livro.quantidade,
                            'imagemLivro':request.build_absolute_uri(pedido_livro.livro.foto_livro.url)
                        }
                        for pedido_livro in PedidoLivro.objects.filter(pedido=pedido)
                    ]

                    pedidos_list.append({
                        'id': str(pedido.id),
                        'valorTotal': float(pedido.valor_total),
                        'dataPedido': pedido.data_pedido, 
                        'horaPedido': pedido.hora_pedido, 
                        'statusPedido': pedido.status_pedido,
                        'livros': livros_details
                    })

                return JsonResponse(pedidos_list, safe=False)
            except Exception as e:
                return HttpResponse(f'Falha ao tentar buscar os pedidos: {e}', status=500)
        else:
            return HttpResponse('Usuário não autenticado.', status=403)
    else:
        return HttpResponse('Método não suportado.', status=405)

@csrf_exempt
def get_pedido_by_id(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                pedido_id = request.GET.get('id', None)
                if not pedido_id:
                    return HttpResponse(status=400)
                
                pedido = Pedidos.objects.get(id=pedido_id)
                if not pedido:
                    return HttpResponse(status=400)

                livros_details = [
                    {
                        'id': str(pedido_livro.livro.id),
                        'nome': pedido_livro.livro.nome,
                        'preco': float(pedido_livro.livro.preco),
                        'quantidade': pedido_livro.quantidade,
                        'imagemLivro':request.build_absolute_uri(pedido_livro.livro.foto_livro.url),
                        'isbn':pedido_livro.livro.isbn,
                        'nomeAutor': pedido_livro.livro.nome_autor
                    }
                    for pedido_livro in PedidoLivro.objects.filter(pedido=pedido)
                ]

                pedido_formatted = {
                    'id': str(pedido.id),
                    'valorTotal': float(pedido.valor_total),
                    'dataPedido': pedido.data_pedido, 
                    'horaPedido': pedido.hora_pedido, 
                    'statusPedido': pedido.status_pedido,
                    'livros': livros_details,
                    'dataEntrega':pedido.data_pedido_entregue,
                    'enderecoSaida':pedido.endereco_saida,
                    'enderecoEntrega':pedido.endereco_entrega
                }

                return JsonResponse(pedido_formatted, safe=False)
            except Exception as e:
                return HttpResponse(f'Falha ao tentar buscar os pedidos: {e}', status=500)
        else:
            return HttpResponse('Usuário não autenticado.', status=403)
    else:
        return HttpResponse('Método não suportado.', status=405)
    
@csrf_exempt
def get_all_sales_data(request):
    if request.method == 'GET' and request.user.is_authenticated and request.user.is_staff:
            try:
                livros = Livros.objects.all()

                sales_data = []
                for livro in livros:
                    sales_count = PedidoLivro.objects.filter(livro=livro).aggregate(total=Sum('quantidade'))['total']
                    sales_count = sales_count or 0  

                    total_revenue = float(livro.preco) * sales_count

                    sales_data.append({
                        "id": str(livro.id),
                        "nome": livro.nome,
                        "preco": float(livro.preco),
                        "quantidadeVendido": sales_count,
                        "estoque": livro.estoque,
                        "imagemLivro":request.build_absolute_uri(livro.foto_livro.url),
                        "totalEarned":total_revenue,
                    })

                return JsonResponse(sales_data, safe=False, status=200)

            except Exception as e:
                return HttpResponse(f"Erro ao buscar os dados de venda. {e}", status=500)
    else:
        return HttpResponse("Usuário não autorizado.", status=403)
    
@csrf_exempt 
def get_book_order_data(request):
    if request.method == 'GET' and request.user.is_authenticated and request.user.is_staff:
        book_id = request.headers.get('id')

        if not book_id:
            return JsonResponse({"error": "Book ID is required in the request header"}, status=400)

        try:
            # Try to retrieve the book using the given ID
            book = Livros.objects.get(id=book_id)
        except Livros.DoesNotExist:
            return JsonResponse({"error": "Book not found"}, status=404)

        # Query the Pedidos that contain this book
        pedidos = Pedidos.objects.filter(livros=book)

        if not pedidos.exists():
            return JsonResponse({"message": "No orders found for this book"}, status=404)

        # Variables to track total earnings and total quantity sold
        total_earnings = 0
        total_books_sold = 0

        pedidos_data = []
        for pedido in pedidos:
            # Query for the specific 'PedidoLivro' entries that link the book and this order
            pedido_livros = PedidoLivro.objects.filter(pedido=pedido, livro=book)
            for pedido_livro in pedido_livros:
                # Calculate the total earnings for this book in this order
                total_earnings += book.preco * pedido_livro.quantidade
                total_books_sold += pedido_livro.quantidade
            
            # Prepare the pedido data to include in the response
            pedido_info = {
                "pedido_id": pedido.id,
                "valor_total": str(pedido.valor_total),
                "data_pedido": pedido.data_pedido,
                "hora_pedido": pedido.hora_pedido,
                "status_pedido": pedido.status_pedido,
                "data_pedido_entregue": pedido.data_pedido_entregue,
                "endereco_entrega": pedido.endereco_entrega,
                "endereco_saida": pedido.endereco_saida,
                "quantidade": sum(pedido_livro.quantidade for pedido_livro in pedido_livros),
            }
            pedidos_data.append(pedido_info)

        # Prepare the response with the book data, associated orders, total earnings, and total books sold
        response_data = {
            "book": {
                "id": book.id,
                "nome": book.nome,
                "preco": str(book.preco),
                "estoque": book.estoque,
                "isbn": book.isbn,
                "categoria": book.categoria,
                "nome_autor": book.nome_autor,
                "data_lancamento": book.data_lancamento,
                "foto_livro": request.build_absolute_uri(book.foto_livro.url),
            },
            "pedidos": pedidos_data,
            "total_earnings": str(total_earnings),  # Return total earnings as a string (for consistent formatting)
            "total_books_sold": total_books_sold,
        }

        return JsonResponse(response_data)
    else:
        return JsonResponse(status=400)

    
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