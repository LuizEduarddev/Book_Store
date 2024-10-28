from django.db import models

class Produto(models.Model):
    nome = models.CharField(max_length=100)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    estoque = models.IntegerField()

    class Meta:
        managed = True
        db_table = 'produto'


class Pedido(models.Model):
    valor_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    nome_cliente = models.CharField(max_length=100)
    produtos = models.ManyToManyField(Produto, through='PedidoProduto')

    class Meta:
        managed = True
        db_table = 'pedido'


class PedidoProduto(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.IntegerField(default=1)

    class Meta:
        managed = True
        db_table = 'pedido_produto'
