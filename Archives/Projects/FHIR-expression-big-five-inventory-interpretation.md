---
author: Lam
date: 2024-12-14T04:16:05+01:00
title: FHIR expression big five inventory interpretation
tags:
- FHIR
- konsulin
- psychometric
---

# O 0-20, C 0-20, E 0-20, A 0-20, N 0-20  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20)
```

Kamu cenderung lebih santai dalam menghadapi situasi, tidak terlalu terbuka, dan nyaman dengan rutinitas yang sudah ada. Kamu menikmati kehidupan yang sederhana dan terfokus pada keseharian yang stabil.

# O 0-20, C 0-20, E 0-20, A 0-20, N 21-40  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20).not()
```

Perasaan cemas atau kekhawatiran bisa lebih sering muncul, namun kamu tetap memiliki potensi untuk belajar bagaimana menghadapinya. Menjaga keseimbangan emosi bisa membantu merasa lebih tenang dan terkontrol.

# O 0-20, C 0-20, E 0-20, A 21-40, N 0-20  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20)
```

Kamu pribadi yang sangat menyenangkan dan penuh perhatian terhadap orang lain. Keharmonisan dalam hubungan sosial penting bagi kamu, dan kamu cenderung memberikan perhatian pada kebutuhan orang di sekitarmu.

# O 0-20, C 0-20, E 0-20, A 21-40, N 21-40  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20).not()
```

Meskipun sangat peduli terhadap orang lain, kadang perasaan cemas dapat mempengaruhi kenyamananmu dalam berinteraksi. Fokus pada perawatan diri dan mengelola stres bisa meningkatkan kesejahteraan emosionalmu.

# O 0-20, C 0-20, E 21-40, A 0-20, N 0-20  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20)
```

Kamu memiliki energi yang tinggi dan senang berinteraksi dengan orang lain. Sosialisasi memberi kamu semangat, dan keinginan untuk terlibat dalam aktivitas yang menyenangkan sering kali menjadi bagian dari hidupmu.

# O 0-20, C 0-20, E 21-40, A 0-20, N 21-40  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20).not()
```

Kamu cenderung penuh energi dan suka berinteraksi, tetapi terkadang kecemasan bisa mengganggu. Menemukan cara untuk menenangkan diri bisa membantu menjaga keseimbangan emosi di tengah interaksi sosial.

# O 0-20, C 0-20, E 21-40, A 21-40, N 0-20  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20)
```

Kamu adalah sosok yang sangat ramah dan menikmati hubungan dengan orang lain. Kamu juga memiliki kemampuan untuk membuat orang merasa dihargai, memberikan kontribusi positif pada lingkaran sosialmu.

# O 0-20, C 0-20, E 21-40, A 21-40, N 21-40  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20).not()
```

Kehidupan sosial sangat penting bagimu, tetapi kecemasan kadang membuatmu merasa cemas. Fokus pada strategi untuk menjaga ketenangan dapat membantu kamu merasa lebih percaya diri dan tenang dalam berinteraksi.

# O 0-20, C 21-40, E 0-20, A 0-20, N 0-20  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20)
```

Kamu cenderung terstruktur dan penuh tanggung jawab dalam kehidupan sehari-hari. Menyukai rutinitas dapat membantu kamu merasa lebih nyaman dan terkendali. Keseimbangan yang baik antara pekerjaan dan istirahat akan mendukung kesejahteraanmu.

# O 0-20, C 21-40, E 0-20, A 0-20, N 21-40  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20).not()
```

Kamu sangat terorganisir dan penuh tanggung jawab, namun terkadang kecemasan bisa muncul. Cobalah untuk memberi ruang untuk relaksasi dan menemukan cara untuk mengelola kekhawatiran agar merasa lebih tenang.

# O 0-20, C 21-40, E 0-20, A 21-40, N 0-20  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20)
```

Kamu memiliki kedisiplinan yang kuat, serta mampu berempati dan mendukung orang di sekitarmu. Menjaga keseimbangan antara tanggung jawab dan perhatian terhadap diri sendiri akan meningkatkan kualitas hidupmu.

# O 0-20, C 21-40, E 0-20, A 21-40, N 21-40  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20).not()
```

Kamu sangat peduli terhadap orang lain, namun kecemasan bisa mengganggu rasa nyamanmu. Menemukan cara untuk menyeimbangkan perhatian terhadap diri sendiri dan orang lain akan memberikan dampak positif dalam hidupmu.

# O 0-20, C 21-40, E 21-40, A 0-20, N 0-20  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20)
```

Kamu memiliki semangat tinggi dan menikmati interaksi dengan banyak orang. Sifatmu yang terorganisir dan penuh disiplin memberikan kamu kepercayaan diri dalam mencapai tujuan.

# O 0-20, C 21-40, E 21-40, A 0-20, N 21-40  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20).not()
```

Kamu energik dan suka berinteraksi dengan banyak orang, meskipun kadang kecemasan bisa memengaruhi kenyamananmu. Fokus pada pengelolaan stres dan menjaga keseimbangan hidup dapat meningkatkan rasa tenang.

# O 0-20, C 21-40, E 21-40, A 21-40, N 0-20  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20)
```

Kamu memiliki energi yang tinggi dan sangat peduli dengan orang lain. Kemampuan untuk bekerja sama dengan baik dan menjaga hubungan yang sehat memberikan banyak kebaikan bagi dirimu dan lingkungan sekitar.

# O 0-20, C 21-40, E 21-40, A 21-40, N 21-40  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20).not()
```

Kehidupan sosial penuh warna memberikan semangat bagi kamu, meski terkadang kecemasan datang. Dengan dukungan diri dan keterampilan mengelola stres, kamu bisa menghadapinya dengan lebih percaya diri.

# O 21-40, C 0-20, E 0-20, A 0-20, N 0-20  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20)
```

Kamu cenderung lebih terbuka terhadap ide-ide baru dan berorientasi pada hal-hal yang bersifat kreatif. Namun, kamu cenderung memilih rutinitas yang sederhana dan tidak banyak perubahan dalam hidupmu.

# O 21-40, C 0-20, E 0-20, A 0-20, N 21-40  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20).not()
```

Kamu terbuka untuk berbagai pengalaman baru, tetapi terkadang perasaan cemas bisa menghalangi kenyamananmu. Fokus pada pengelolaan stres dan menjaga keseimbangan bisa meningkatkan kenyamanan hidupmu.

# O 21-40, C 0-20, E 0-20, A 21-40, N 0-20  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20)
```

Kamu terbuka dengan ide-ide baru dan suka berinteraksi, serta memiliki kepedulian yang besar terhadap orang lain. Menjaga keseimbangan antara kreativitas dan hubungan sosial akan memberikan kebahagiaan lebih.

# O 21-40, C 0-20, E 0-20, A 21-40, N 21-40  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20).not()
```

Kreativitas dan perhatian terhadap orang lain adalah kekuatanmu, namun perasaan cemas bisa muncul. Mengelola stres dan menjaga hubungan sosial tetap kuat akan membantu kamu merasa lebih stabil.

# O 21-40, C 0-20, E 21-40, A 0-20, N 0-20  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20)
```

Kamu sangat terbuka pada pengalaman baru dan memiliki semangat tinggi dalam berinteraksi. Mencari cara untuk merencanakan dan mengelola energimu akan membantu menjaga keseimbangan dalam hidupmu.

# O 21-40, C 0-20, E 21-40, A 0-20, N 21-40  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20).not()
```

Kamu terbuka untuk hal-hal baru dan penuh semangat dalam berinteraksi, namun terkadang kecemasan datang. Fokus pada cara untuk menjaga ketenangan dalam beraktivitas akan meningkatkan kualitas hidupmu.

# O 21-40, C 0-20, E 21-40, A 21-40, N 0-20  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20)
```

Kamu menikmati kehidupan sosial yang aktif dan memiliki kreativitas tinggi. Kemampuanmu dalam berinteraksi dengan orang lain memberikan energi positif, serta membuat hubungan lebih bermakna.

# O 21-40, C 0-20, E 21-40, A 21-40, N 21-40  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20).not()
```

Kreativitas dan energi tinggi mendukung kehidupan sosialmu, meskipun kecemasan dapat muncul. Mengelola kecemasan dan menemukan cara untuk merencanakan bisa meningkatkan kesejahteraan emosionalmu.

# O 21-40, C 21-40, E 0-20, A 0-20, N 0-20  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20)
```

Kamu terbuka terhadap pengalaman baru dan disiplin dalam merencanakan hidup. Keinginan untuk belajar dan tumbuh memberikan banyak peluang dalam mencapai tujuan.

# O 21-40, C 21-40, E 0-20, A 0-20, N 21-40  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20).not()
```

Kreativitas dan disiplin memberikan kamu keunggulan dalam merencanakan hidup, namun kecemasan bisa menjadi tantangan. Mengelola stres dan menjaga ketenangan akan memberikan rasa stabilitas.

# O 21-40, C 21-40, E 0-20, A 21-40, N 0-20  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20)
```

Kamu terbuka dengan ide-ide baru dan disiplin dalam merencanakan hidup, dengan kepedulian yang tinggi terhadap orang lain. Keseimbangan antara kreativitas dan perhatian sosial akan membuatmu lebih puas.

# O 21-40, C 21-40, E 0-20, A 21-40, N 21-40  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20).not()
```

Kreativitas dan perhatian terhadap orang lain adalah kekuatanmu, meskipun kecemasan terkadang muncul. Mengelola stres dengan cara yang sehat akan membantu kamu merasa lebih tenang dan terhubung.

# O 21-40, C 21-40, E 21-40, A 0-20, N 0-20  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20)
```

Kreativitas, disiplin, dan energi tinggi mendukung kemampuanmu dalam meraih tujuan. Kamu memiliki potensi untuk terus berkembang dan menemukan cara untuk menjaga keseimbangan hidup yang positif.

# O 21-40, C 21-40, E 21-40, A 0-20, N 21-40  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20)
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20).not()
```

Kreativitas dan energi tinggi sering kali menyemangati hidupmu, meskipun perasaan cemas terkadang muncul. Fokus pada pengelolaan stres dapat membantumu merasa lebih tenang dan percaya diri.

# O 21-40, C 21-40, E 21-40, A 21-40, N 0-20  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20)
```

Kreativitas, disiplin, dan energi tinggi mendukung hubungan sosial yang sehat. Menjaga keseimbangan antara pencapaian dan relaksasi akan membuat hidup lebih memuaskan dan bermakna.

# O 21-40, C 21-40, E 21-40, A 21-40, N 21-40  

```
(%resource.item.item.item.where(
  linkId = 'openness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'conscientiousness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'extroversion'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'agreeableness'
).answer.valueInteger <= 20).not()
and
(%resource.item.item.item.where(
  linkId = 'neuroticism'
).answer.valueInteger <= 20).not()
```

Kamu adalah sosok yang kreatif, energik, dan penuh perhatian. Meskipun terkadang kecemasan muncul, mengelola stres dengan bijak akan membantu kamu tetap seimbang dan merasa puas dalam hidup.

# Relevant notes

- [GPT-prompt-to-interpret-big-five-inventory-results](Projects/GPT-prompt-to-interpret-big-five-inventory-results.md) 
