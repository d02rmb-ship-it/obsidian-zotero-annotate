
{% if zt.notes.size > 0 %}
## Notes
{% for note in zt.notes %}
- {{ note.noteLink }}
{% endfor %}
{% endif %}
{% assign categories = "Background|Literature Review|Theory|Gap|Method|Findings|Contribution" | split: "|" %}
{% if zt.annotations.size > 0 %}
## Research Evidence
{% for category in categories %}
{% assign matches = 0 %}
{% for annotation in zt.annotations %}
{% for tag in annotation.tags %}
{% assign tag_name = tag.name | downcase | strip %}
{% assign category_name = category | downcase %}
{% if tag_name == category_name %}
{% assign matches = matches | plus: 1 %}
{% endif %}
{% endfor %}
{% endfor %}
{% if matches > 0 %}
### {{ category }}
{% for annotation in zt.annotations %}
{% assign matching = false %}
{% for tag in annotation.tags %}
{% assign tag_name = tag.name | downcase | strip %}
{% assign category_name = category | downcase %}
{% if tag_name == category_name %}
{% assign matching = true %}
{% endif %}
{% endfor %}
{% if matching %}
{% render "annotation" with annotation as zt %}
{% endif %}
{% endfor %}
{% endif %}
{% endfor %}
{% assign unclassified_count = 0 %}
{% for annotation in zt.annotations %}
{% assign classified = false %}
{% for tag in annotation.tags %}
{% assign tag_name = tag.name | downcase | strip %}
{% for category in categories %}
{% assign category_name = category | downcase %}
{% if tag_name == category_name %}
{% assign classified = true %}
{% endif %}
{% endfor %}
{% endfor %}
{% unless classified %}
{% assign unclassified_count = unclassified_count | plus: 1 %}
{% endunless %}
{% endfor %}
{% if unclassified_count > 0 %}
### Unclassified
{% for annotation in zt.annotations %}
{% assign classified = false %}
{% for tag in annotation.tags %}
{% assign tag_name = tag.name | downcase | strip %}
{% for category in categories %}
{% assign category_name = category | downcase %}
{% if tag_name == category_name %}
{% assign classified = true %}
{% endif %}
{% endfor %}
{% endfor %}
{% unless classified %}
{% render "annotation" with annotation as zt %}
{% endunless %}
{% endfor %}
{% endif %}
{% endif %}
