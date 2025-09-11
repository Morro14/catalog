import django_filters
from .models import Entry, Tag, Type


class EntryFilter(django_filters.FilterSet):
    tags = django_filters.CharFilter(method="filter_tags")

    class Meta:
        model = Entry
        fields = ["tags"]

    def filter_tags(self, queryset, name, value):
        raw_values = self.request.GET.getlist("tags")
        tags = []

        for v in raw_values:
            tags.extend([t.strip() for t in v.split(",") if t.strip()])

        if tags:
            return queryset.filter(tags__name__in=tags).distinct()
        return queryset
