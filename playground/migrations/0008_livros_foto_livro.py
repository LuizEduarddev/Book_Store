# Generated by Django 5.1.2 on 2024-11-06 13:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('playground', '0007_pedidos_data_pedido_pedidos_hora_pedido'),
    ]

    operations = [
        migrations.AddField(
            model_name='livros',
            name='foto_livro',
            field=models.ImageField(default='', upload_to=''),
        ),
    ]
