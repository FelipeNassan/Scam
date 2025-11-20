#!/usr/bin/env python3
import json
import random

# Carregar questions.json existente
with open('Scam/src/data/questions.json', 'r', encoding='utf-8') as f:
    existing_questions = json.load(f)

# Template de questões por interesse
# Cada interesse terá questões sobre golpes relacionados a esse tema
questions_templates = {
    "Carros": [
        {
            "question": "Qual golpe é comum na venda de carros usados online?",
            "options": [
                {"label": "A", "text": "Venda de carros com histórico adulterado ou sinistros não informados"},
                {"label": "B", "text": "Carros com garantia de fábrica"},
                {"label": "C", "text": "Documentação completa e verificada"},
                {"label": "D", "text": "Inspeção pré-compra disponível"}
            ],
            "correct": "A",
            "tip": "Golpistas vendem carros com histórico adulterado, escondendo sinistros, acidentes ou problemas mecânicos graves, enganando compradores que acreditam estar adquirindo um veículo em bom estado.",
            "interests": ["Carros", "Tecnologia", "Empreendedorismo"]
        },
        {
            "question": "Que fraude ocorre em anúncios de peças automotivas online?",
            "options": [
                {"label": "A", "text": "Venda de peças falsificadas ou usadas como novas"},
                {"label": "B", "text": "Peças originais com nota fiscal"},
                {"label": "C", "text": "Garantia do fabricante"},
                {"label": "D", "text": "Instalação profissional incluída"}
            ],
            "correct": "A",
            "tip": "Fraudadores vendem peças automotivas falsificadas ou usadas como se fossem novas e originais, colocando em risco a segurança do veículo e enganando compradores que esperam peças de qualidade.",
            "interests": ["Carros", "Tecnologia", "Empreendedorismo"]
        },
        {
            "question": "Qual golpe é frequente em sites de seguro de carro?",
            "options": [
                {"label": "A", "text": "Venda de seguros falsos que não cobrem sinistros"},
                {"label": "B", "text": "Seguro com cobertura completa"},
                {"label": "C", "text": "Apolice registrada na SUSEP"},
                {"label": "D", "text": "Atendimento 24 horas"}
            ],
            "correct": "A",
            "tip": "Golpistas vendem seguros automotivos falsos que não têm validade legal, deixando proprietários sem cobertura quando precisam acionar o seguro após um sinistro.",
            "interests": ["Carros", "Investimentos", "Tecnologia"]
        },
        {
            "question": "Que tipo de fraude ocorre na venda de acessórios automotivos online?",
            "options": [
                {"label": "A", "text": "Venda de acessórios com fotos falsas que não correspondem ao produto real"},
                {"label": "B", "text": "Acessórios originais de fábrica"},
                {"label": "C", "text": "Instalação garantida"},
                {"label": "D", "text": "Garantia do fabricante"}
            ],
            "correct": "A",
            "tip": "Fraudadores usam fotos de acessórios automotivos de alta qualidade para vender produtos de baixa qualidade que não correspondem às imagens, enganando compradores que esperam receber itens de boa qualidade.",
            "interests": ["Carros", "Design", "Tecnologia"]
        },
        {
            "question": "Qual golpe é comum em anúncios de cursos de mecânica automotiva online?",
            "options": [
                {"label": "A", "text": "Venda de cursos com certificados falsos ou conteúdo de baixa qualidade"},
                {"label": "B", "text": "Cursos com aulas práticas presenciais"},
                {"label": "C", "text": "Material didático completo"},
                {"label": "D", "text": "Certificado reconhecido pelo MEC"}
            ],
            "correct": "A",
            "tip": "Golpistas oferecem cursos de mecânica automotiva online prometendo certificados que não são reconhecidos ou cursos com conteúdo de baixa qualidade, enganando estudantes que investem tempo e dinheiro.",
            "interests": ["Carros", "Educação", "Tecnologia"]
        }
    ],
    "Cinema": [
        {
            "question": "Qual golpe é comum na venda de ingressos de cinema online?",
            "options": [
                {"label": "A", "text": "Venda de ingressos falsificados ou já utilizados"},
                {"label": "B", "text": "Ingressos válidos para qualquer sessão"},
                {"label": "C", "text": "Desconto garantido"},
                {"label": "D", "text": "Troca facilitada"}
            ],
            "correct": "A",
            "tip": "Golpistas vendem ingressos de cinema falsificados ou que já foram utilizados, deixando compradores sem acesso ao filme e sem o dinheiro investido.",
            "interests": ["Cinema", "Tecnologia", "Cultura Pop"]
        },
        {
            "question": "Que fraude ocorre em sites de streaming pirata de filmes?",
            "options": [
                {"label": "A", "text": "Cobrança por assinaturas que não funcionam ou instalam vírus"},
                {"label": "B", "text": "Acesso a filmes originais"},
                {"label": "C", "text": "Qualidade HD garantida"},
                {"label": "D", "text": "Suporte técnico disponível"}
            ],
            "correct": "A",
            "tip": "Fraudadores oferecem assinaturas de streaming pirata que não funcionam ou instalam malware nos dispositivos, colocando em risco a segurança dos usuários e enganando quem busca conteúdo gratuito.",
            "interests": ["Cinema", "Tecnologia", "Cultura Pop"]
        },
        {
            "question": "Qual golpe é frequente na venda de DVDs e Blu-rays falsificados?",
            "options": [
                {"label": "A", "text": "Venda de cópias piratas com qualidade inferior ou que não funcionam"},
                {"label": "B", "text": "Produtos originais lacrados"},
                {"label": "C", "text": "Garantia do fabricante"},
                {"label": "D", "text": "Extras e comentários do diretor"}
            ],
            "correct": "A",
            "tip": "Golpistas vendem DVDs e Blu-rays falsificados que têm qualidade de imagem e som muito inferior ou que não funcionam em alguns aparelhos, enganando compradores que esperam receber produtos originais.",
            "interests": ["Cinema", "Tecnologia", "Cultura Pop"]
        },
        {
            "question": "Que tipo de fraude ocorre em anúncios de cursos de cinema online?",
            "options": [
                {"label": "A", "text": "Venda de cursos com promessas de carreira que não são cumpridas"},
                {"label": "B", "text": "Cursos com professores renomados"},
                {"label": "C", "text": "Certificado reconhecido"},
                {"label": "D", "text": "Acesso vitalício ao conteúdo"}
            ],
            "correct": "A",
            "tip": "Fraudadores vendem cursos de cinema prometendo oportunidades de carreira e conexões na indústria que nunca se materializam, enganando estudantes que investem tempo e dinheiro esperando avançar na carreira.",
            "interests": ["Cinema", "Educação", "Empreendedorismo"]
        },
        {
            "question": "Qual golpe é comum em sites de venda de memorabilia de cinema?",
            "options": [
                {"label": "A", "text": "Venda de itens falsificados como autênticos de filmes famosos"},
                {"label": "B", "text": "Itens autenticados por especialistas"},
                {"label": "C", "text": "Certificado de autenticidade"},
                {"label": "D", "text": "História do item documentada"}
            ],
            "correct": "A",
            "tip": "Golpistas vendem itens falsificados como se fossem memorabilia autêntica de filmes famosos, cobrando valores altos por itens que não têm valor real ou histórico.",
            "interests": ["Cinema", "Cultura Pop", "Tecnologia"]
        },
        {
            "question": "Que fraude ocorre em anúncios de festivais de cinema falsos?",
            "options": [
                {"label": "A", "text": "Cobrança de taxas de inscrição para festivais que não existem"},
                {"label": "B", "text": "Festivais reconhecidos internacionalmente"},
                {"label": "C", "text": "Júri de profissionais da indústria"},
                {"label": "D", "text": "Premiação em dinheiro"}
            ],
            "correct": "A",
            "tip": "Fraudadores criam festivais de cinema falsos e cobram taxas de inscrição de cineastas, desaparecendo sem realizar o evento prometido e deixando participantes sem o dinheiro investido.",
            "interests": ["Cinema", "Empreendedorismo", "Tecnologia"]
        },
        {
            "question": "Qual golpe é frequente na venda de roteiros de filmes online?",
            "options": [
                {"label": "A", "text": "Venda de roteiros plagiados ou genéricos como originais"},
                {"label": "B", "text": "Roteiros originais protegidos por direitos autorais"},
                {"label": "C", "text": "Feedback de profissionais"},
                {"label": "D", "text": "Oportunidades de produção"}
            ],
            "correct": "A",
            "tip": "Golpistas vendem roteiros de filmes que são plagiados de outros trabalhos ou roteiros genéricos como se fossem originais e únicos, enganando compradores que esperam conteúdo original.",
            "interests": ["Cinema", "Leitura", "Empreendedorismo"]
        },
        {
            "question": "Que tipo de fraude ocorre em sites de crowdfunding para filmes?",
            "options": [
                {"label": "A", "text": "Arrecadação de dinheiro para projetos que nunca são realizados"},
                {"label": "B", "text": "Projetos com equipe comprovada"},
                {"label": "C", "text": "Transparência total do orçamento"},
                {"label": "D", "text": "Recompensas garantidas para apoiadores"}
            ],
            "correct": "A",
            "tip": "Fraudadores criam campanhas de crowdfunding para filmes que nunca são produzidos, desaparecendo com o dinheiro arrecadado e deixando apoiadores sem o projeto prometido e sem reembolso.",
            "interests": ["Cinema", "Empreendedorismo", "Investimentos"]
        },
        {
            "question": "Qual golpe é comum em anúncios de equipamentos de filmagem baratos?",
            "options": [
                {"label": "A", "text": "Venda de equipamentos com defeito ou de qualidade muito inferior"},
                {"label": "B", "text": "Equipamentos novos de fábrica"},
                {"label": "C", "text": "Garantia do fabricante"},
                {"label": "D", "text": "Suporte técnico disponível"}
            ],
            "correct": "A",
            "tip": "Golpistas vendem equipamentos de filmagem com preços muito abaixo do mercado, mas enviam produtos com defeito ou de qualidade muito inferior, enganando cineastas que esperam equipamentos funcionais.",
            "interests": ["Cinema", "Fotografia", "Tecnologia"]
        }
    ]
}

# Adicionar mais questões conforme necessário...
# Por limitações de espaço, vou criar um script que gera questões programaticamente

print(f"Templates criados para {len(questions_templates)} interesses")
print("Continuando a gerar questões...")
