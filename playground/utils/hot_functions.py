import requests
import base64
from ..models import Pedidos, Livros, PedidoLivro
import json
import google.generativeai as genai
from django.http import HttpResponse, JsonResponse

def fotoToBase64(image_url):
    response = requests.get(image_url)
    response.raise_for_status()  
    
    image_base64 = base64.b64encode(response.content).decode('utf-8')
    input_data = {'mime_type': 'image/jpeg', 'data': image_base64}
    return input_data

def livrosToJson():
    livros_all = Livros.objects.filter(estoque__gt=0)
    livros = []
    for book in livros_all:
        livro = {
            "id":str(book.id),
            "nome": book.nome,
            "preco": str(book.preco),
            "categoria": book.categoria,
            "nome_autor": book.nome_autor,
            "data_lancamento": book.data_lancamento,
        }
        livros.append(livro)
    
    return json.dumps(livros, ensure_ascii=False)

def execute_photo_prompt(prompt, request):
    livros_all = Livros.objects.filter(estoque__gt=0)

    fotos_base_64 = []
    
    for livro in livros_all:
        fotos_base_64.append(fotoToBase64(request.build_absolute_uri(livro.foto_livro.url)))
    
    instruction = f"""
        All questions you need to answer based on this photodataset {fotos_base_64}, compare the images on the dataset with the users answer
    """
            
    model = genai.GenerativeModel(
        model_name="gemini-1.5-pro",
        system_instruction=instruction
    )

    result = model.generate_content(prompt)
    return JsonResponse(result.text, status=200, safe=False)
