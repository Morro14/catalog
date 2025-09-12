import django_filters
from .models import Entry, Tag, Category
from django.db.models import Count, Q


class EntryFilter(django_filters.FilterSet):
    tags = django_filters.CharFilter(method="filter_tags")
    category = django_filters.CharFilter(
        field_name="category__name", lookup_expr="exact"
    )
    tags_mode = django_filters.ChoiceFilter(
        choices=[("or", "OR"), ("and", "AND")],
        method="filter_tag_mode",
        label="Tags filter mode",
    )

    class Meta:
        model = Entry
        fields = ["tags", "category"]

    def filter_tags(self, queryset, name, value):
        # print("filter tags")
        raw_values = self.request.GET.getlist("tags")
        # print("raw", raw_values)
        tags = []
        for raw in raw_values:
            tags.extend([t.strip() for t in raw.split(",") if t.strip()])
        self._tags = list(set(tags))

        # print("tags:", tags, type(tags))
        if tags:
            return queryset.filter(
                tags__name__in=tags, user=self.request.user
            ).distinct()
        return queryset

    def filter_tag_mode(self, queryset, name, value):
        tags = getattr(self, "_tags", [])
        if not tags:
            return queryset
        if value == "and":
            if len(tags) == 1:
                return queryset.filter(tags__name__in=tags[0])
            # print("AND", "tags", tags)
            # print("qs:", queryset)
            return queryset.annotate(
                num_matching_tags=Count("tags", filter=Q(tags__name__in=tags))
            ).filter(num_matching_tags=len(tags))

        return queryset
