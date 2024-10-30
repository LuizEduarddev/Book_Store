# Generated by Django 5.1.2 on 2024-10-30 11:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('playground', '0003_alter_livros_categoria_delete_categoria_livro'),
    ]

    operations = [
        migrations.AlterField(
            model_name='livros',
            name='categoria',
            field=models.CharField(choices=[('FICCAO_CIENTIFICA', 'Ficção Científica'), ('ROMANCE', 'Romance'), ('FANTASIA', 'Fantasia'), ('BIOGRAFIA', 'Biografia'), ('AVENTURA', 'Aventura'), ('HISTORIA', 'História'), ('MISTERIO', 'Mistério'), ('TERROR', 'Terror'), ('AUTOAJUDA', 'Autoajuda'), ('EDUCACIONAL', 'Educacional')], max_length=100),
        ),
        migrations.AlterField(
            model_name='livros',
            name='isbn',
            field=models.CharField(max_length=10, unique=True),
        ),
    ]
