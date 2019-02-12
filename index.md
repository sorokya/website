---
layout: default.liquid
title: Home
---

{% for post in collections.posts.pages %}
#### {{post.title}}
{{post.excerpt}}

[Read more!]({{post.permalink}})
{% endfor %}
