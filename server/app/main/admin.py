from django.contrib import admin
from main.models import DataEntry, DataTag, DataType


# Register your models here.


class DataEntryAdmin(admin.ModelAdmin):
    pass


class DataTypeAdmin(admin.ModelAdmin):
    pass


class DataTagAdmin(admin.ModelAdmin):
    pass


admin.site.register(DataEntry, DataEntryAdmin)
admin.site.register(DataType, DataTypeAdmin)
admin.site.register(DataTag, DataTagAdmin)
