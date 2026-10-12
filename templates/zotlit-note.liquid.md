# {{ zt.title }}
**{{ zt.authorsShort }} ({{ zt.date.year }})** | {% for attachment in zt.attachments %}{% if attachment.contentType == "application/pdf" %}[Open PDF]({{ attachment.backlink }}) | {% endif %}{% endfor %}[Zotero Record]({{ zt.backlink }})
## Paper Overview
**Key Contribution:**
**Relevance to My Research:**
**My Observations and Questions:**
{% render "content" with zt as zt %}
