{% bq %}
[!note] [Page {{ zt.pageLabel }}]({{ zt.backlink }})
{{ zt.imgLink | embed }}{{ zt.text }}
{% if zt.tags and zt.tags.size > 0 %}
**Category:** {% for tag in zt.tags %}{{ tag.name }}{% unless forloop.last %}, {% endunless %}{% endfor %}
{% endif %}
{% if zt.comment %}
**My comment:** {{ zt.comment }}
{% endif %}
{% endbq %}




