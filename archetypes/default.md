---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
featuredImage: "cover.png"
slug: {{ substr (md5 (printf "%s%s" .Date (replace .TranslationBaseName "-" " " | title))) 4 8 }}
categories: []
tags: []
draft: true
---

