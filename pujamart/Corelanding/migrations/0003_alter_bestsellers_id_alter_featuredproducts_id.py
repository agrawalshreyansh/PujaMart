# Generated by Django 5.0.7 on 2024-07-29 11:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Corelanding', '0002_featuredproducts'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bestsellers',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='featuredproducts',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
