import uuid
from django.db import models
from .utils.Categories import CATEGORIES

class Livros(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=100)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    estoque = models.IntegerField()
    isbn = models.CharField(max_length=10)
    categoria = models.CharField(max_length=100, choices=CATEGORIES, unique=True)
    nome_autor = models.CharField(max_length=40)
    data_lancamento = models.CharField(max_length=10)

    class Meta:
        managed = True
        db_table = 'livros'

    def __str__(self):
        return self.nome


class Pedidos(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    valor_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    nome_cliente = models.CharField(max_length=100)
    livros = models.ManyToManyField(Livros, through='PedidoLivro')

    class Meta:
        managed = True
        db_table = 'pedidos'


class PedidoLivro(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pedido = models.ForeignKey(Pedidos, on_delete=models.CASCADE)
    livro = models.ForeignKey(Livros, on_delete=models.CASCADE)
    quantidade = models.IntegerField(default=1)

    class Meta:
        managed = True
        db_table = 'pedido_livro'
