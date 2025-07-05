from django.contrib import admin
from main.models import MyUser, DataEntry, DataTag, DataType


# Register your models here.
class MyUserAdmin(admin.ModelAdmin):
    pass


class DataEntryAdmin(admin.ModelAdmin):
    pass


class DataTypeAdmin(admin.ModelAdmin):
    pass


class DataTagAdmin(admin.ModelAdmin):
    pass


admin.site.register(MyUser, MyUserAdmin)
admin.site.register(DataEntry, DataEntryAdmin)
admin.site.register(DataType, DataTypeAdmin)
admin.site.register(DataTag, DataTagAdmin)