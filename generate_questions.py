#!/usr/bin/env python3
import json
import random

# Carregar questions.json existente
with open('Scam/src/data/questions.json', 'r', encoding='utf-8') as f:
    existing_questions = json.load(f)

# Contar questões por interesse
questions_by_interest = {}
for q in existing_questions:
    if 'interests' in q and isinstance(q['interests'], list):
        for interest in q['interests']:
            if interest not in questions_by_interest:
                questions_by_interest[interest] = 0
            questions_by_interest[interest] += 1

# Definir novas questões necessárias
# Formato: {interesse: [lista de questões]}
new_questions = []

# Arquitetura - precisa de 7
arquitetura_questions = [
    {
        "question": "Qual golpe é comum na venda de projetos arquitetônicos online?",
        "options": [
            {"label": "A", "text": "Venda de projetos plagiados de arquitetos famosos"},
            {"label": "B", "text": "Assinatura de revistas de arquitetura"},
            {"label": "C", "text": "Curso presencial de desenho técnico"},
            {"label": "D", "text": "Venda de materiais de construção"}
        ],
        "correct": "A",
        "tip": "Golpistas vendem projetos arquitetônicos copiados de profissionais renomados, violando direitos autorais e enganando clientes que acreditam estar comprando projetos originais.",
        "interests": ["Arquitetura", "Design", "Tecnologia"]
    },
    {
        "question": "Que fraude ocorre com frequência em sites de venda de plantas arquitetônicas?",
        "options": [
            {"label": "A", "text": "Venda de plantas genéricas como projetos personalizados"},
            {"label": "B", "text": "Entrega de projetos em formato PDF"},
            {"label": "C", "text": "Consultoria gratuita de arquitetura"},
            {"label": "D", "text": "Venda de softwares de arquitetura originais"}
        ],
        "correct": "A",
        "tip": "Fraudadores vendem plantas arquitetônicas genéricas como se fossem projetos personalizados, cobrando valores altos por material que não atende às necessidades específicas do cliente.",
        "interests": ["Arquitetura", "Design", "Tecnologia"]
    },
    {
        "question": "Qual golpe é frequente em anúncios de cursos online de arquitetura?",
        "options": [
            {"label": "A", "text": "Venda de cursos com certificados falsos ou inexistentes"},
            {"label": "B", "text": "Aulas presenciais de arquitetura"},
            {"label": "C", "text": "Material didático impresso"},
            {"label": "D", "text": "Tutoria individual garantida"}
        ],
        "correct": "A",
        "tip": "Golpistas oferecem cursos de arquitetura online prometendo certificados que não são reconhecidos ou que nunca são entregues, enganando estudantes que investem tempo e dinheiro.",
        "interests": ["Arquitetura", "Educação", "Tecnologia"]
    },
    {
        "question": "Que tipo de fraude ocorre na venda de softwares de arquitetura piratas?",
        "options": [
            {"label": "A", "text": "Venda de licenças falsas que param de funcionar após alguns dias"},
            {"label": "B", "text": "Software original com desconto"},
            {"label": "C", "text": "Suporte técnico gratuito"},
            {"label": "D", "text": "Atualizações automáticas"}
        ],
        "correct": "A",
        "tip": "Criminosos vendem licenças falsas de softwares de arquitetura que funcionam temporariamente, mas param de funcionar após alguns dias, deixando o comprador sem o produto e sem o dinheiro investido.",
        "interests": ["Arquitetura", "Tecnologia", "Programação"]
    },
    {
        "question": "Qual golpe é comum em sites de venda de maquetes arquitetônicas?",
        "options": [
            {"label": "A", "text": "Venda de maquetes com fotos falsas que não correspondem ao produto real"},
            {"label": "B", "text": "Maquetes personalizadas sob medida"},
            {"label": "C", "text": "Entrega expressa garantida"},
            {"label": "D", "text": "Material de alta qualidade"}
        ],
        "correct": "A",
        "tip": "Fraudadores usam fotos de maquetes profissionais para anunciar produtos de baixa qualidade que não correspondem às imagens, enganando clientes que esperam receber maquetes detalhadas.",
        "interests": ["Arquitetura", "Design", "Tecnologia"]
    },
    {
        "question": "Que fraude ocorre em anúncios de consultoria arquitetônica online?",
        "options": [
            {"label": "A", "text": "Cobrança antecipada sem prestar o serviço prometido"},
            {"label": "B", "text": "Consultoria gratuita inicial"},
            {"label": "C", "text": "Arquitetos certificados"},
            {"label": "D", "text": "Projetos aprovados pelo CREA"}
        ],
        "correct": "A",
        "tip": "Golpistas cobram valores antecipados por consultoria arquitetônica e desaparecem sem fornecer o serviço, deixando clientes sem o dinheiro e sem a orientação profissional prometida.",
        "interests": ["Arquitetura", "Empreendedorismo", "Tecnologia"]
    },
    {
        "question": "Qual golpe é frequente na venda de livros digitais sobre arquitetura?",
        "options": [
            {"label": "A", "text": "Venda de e-books com conteúdo copiado ou arquivos vazios"},
            {"label": "B", "text": "Livros físicos com frete grátis"},
            {"label": "C", "text": "Biblioteca digital completa"},
            {"label": "D", "text": "Acesso vitalício garantido"}
        ],
        "correct": "A",
        "tip": "Fraudadores vendem e-books sobre arquitetura que contêm conteúdo plagiado ou são arquivos vazios, enganando compradores que esperam receber material educacional de qualidade.",
        "interests": ["Arquitetura", "Leitura", "Educação"]
    }
]

new_questions.extend(arquitetura_questions)

# Artesanato - precisa de 7
artesanato_questions = [
    {
        "question": "Qual golpe é comum na venda de materiais para artesanato online?",
        "options": [
            {"label": "A", "text": "Venda de materiais falsificados ou de qualidade inferior ao anunciado"},
            {"label": "B", "text": "Kits completos de artesanato"},
            {"label": "C", "text": "Tutoriais em vídeo inclusos"},
            {"label": "D", "text": "Garantia de satisfação"}
        ],
        "correct": "A",
        "tip": "Golpistas vendem materiais para artesanato que não correspondem à qualidade anunciada, usando fotos de produtos originais para enganar artesãos que esperam receber materiais de boa qualidade.",
        "interests": ["Artesanato", "DIY (Faça Você Mesmo)", "Design"]
    },
    {
        "question": "Que fraude ocorre em sites de venda de tutoriais de artesanato?",
        "options": [
            {"label": "A", "text": "Venda de tutoriais copiados de outros artesãos sem autorização"},
            {"label": "B", "text": "Aulas presenciais de artesanato"},
            {"label": "C", "text": "Material didático impresso"},
            {"label": "D", "text": "Certificado de conclusão"}
        ],
        "correct": "A",
        "tip": "Fraudadores vendem tutoriais de artesanato que são cópias não autorizadas de conteúdo de outros artesãos, violando direitos autorais e enganando compradores.",
        "interests": ["Artesanato", "Educação", "DIY (Faça Você Mesmo)"]
    },
    {
        "question": "Qual golpe é frequente em grupos de artesanato nas redes sociais?",
        "options": [
            {"label": "A", "text": "Venda de produtos artesanais com fotos falsas que não correspondem ao produto real"},
            {"label": "B", "text": "Produtos feitos à mão"},
            {"label": "C", "text": "Entrega rápida garantida"},
            {"label": "D", "text": "Suporte pós-venda"}
        ],
        "correct": "A",
        "tip": "Golpistas usam fotos de produtos artesanais profissionais para vender itens de baixa qualidade ou produtos industrializados, enganando compradores que esperam receber artesanato autêntico.",
        "interests": ["Artesanato", "Design", "Tecnologia"]
    },
    {
        "question": "Que tipo de fraude ocorre na venda de cursos online de artesanato?",
        "options": [
            {"label": "A", "text": "Cobrança por cursos que não são entregues ou têm conteúdo de baixa qualidade"},
            {"label": "B", "text": "Aulas ao vivo interativas"},
            {"label": "C", "text": "Material incluso no curso"},
            {"label": "D", "text": "Acesso vitalício à plataforma"}
        ],
        "correct": "A",
        "tip": "Fraudadores cobram por cursos de artesanato que nunca são disponibilizados ou contêm conteúdo de baixa qualidade, deixando alunos sem o conhecimento prometido e sem o dinheiro investido.",
        "interests": ["Artesanato", "Educação", "Tecnologia"]
    },
    {
        "question": "Qual golpe é comum em marketplaces de artesanato?",
        "options": [
            {"label": "A", "text": "Venda de produtos artesanais importados como se fossem nacionais"},
            {"label": "B", "text": "Produtos feitos por artesãos locais"},
            {"label": "C", "text": "História do artesão incluída"},
            {"label": "D", "text": "Suporte ao artesão local"}
        ],
        "correct": "A",
        "tip": "Golpistas vendem produtos industrializados importados como se fossem artesanato nacional, enganando consumidores que querem apoiar artesãos locais e receber produtos autênticos.",
        "interests": ["Artesanato", "Empreendedorismo", "Tecnologia"]
    },
    {
        "question": "Que fraude ocorre em anúncios de kits de artesanato com desconto?",
        "options": [
            {"label": "A", "text": "Venda de kits incompletos ou com materiais de qualidade inferior"},
            {"label": "B", "text": "Kits completos com todos os materiais"},
            {"label": "C", "text": "Instruções detalhadas inclusas"},
            {"label": "D", "text": "Garantia de qualidade"}
        ],
        "correct": "A",
        "tip": "Fraudadores oferecem kits de artesanato com descontos atraentes, mas enviam kits incompletos ou com materiais de qualidade muito inferior ao anunciado, deixando compradores sem todos os itens necessários.",
        "interests": ["Artesanato", "DIY (Faça Você Mesmo)", "Tecnologia"]
    },
    {
        "question": "Qual golpe é frequente na venda de padrões e moldes de artesanato?",
        "options": [
            {"label": "A", "text": "Venda de padrões copiados sem autorização ou arquivos corrompidos"},
            {"label": "B", "text": "Padrões originais e testados"},
            {"label": "C", "text": "Suporte para dúvidas"},
            {"label": "D", "text": "Atualizações de novos padrões"}
        ],
        "correct": "A",
        "tip": "Golpistas vendem padrões e moldes de artesanato que são cópias não autorizadas de outros criadores ou arquivos que não podem ser abertos, enganando artesãos que precisam de moldes confiáveis.",
        "interests": ["Artesanato", "Design", "Tecnologia"]
    }
]

new_questions.extend(artesanato_questions)

# Continuar com os outros interesses... (vou criar um script mais eficiente)
print(f"Geradas {len(new_questions)} questões até agora")
print("Continuando...")

