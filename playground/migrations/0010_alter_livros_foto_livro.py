# Generated by Django 5.1.2 on 2024-11-06 14:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('playground', '0009_alter_livros_foto_livro'),
    ]

    operations = [
        migrations.AlterField(
            model_name='livros',
            name='foto_livro',
            field=models.ImageField(upload_to='images/'),
        ),
    ]