#!/usr/bin/env python3
"""
Script para gerar todas as questões necessárias para que cada interesse tenha pelo menos 10 questões.
Total necessário: ~157 questões novas
"""
import json
import random

# Carregar questions.json existente
with open('Scam/src/data/questions.json', 'r', encoding='utf-8') as f:
    existing_questions = json.load(f)

print(f"Questões existentes: {len(existing_questions)}")

# Função auxiliar para criar questões com opções embaralhadas
def create_question(question_text, correct_text, wrong_texts, tip, interests):
    """Cria uma questão com opções embaralhadas"""
    letters = ['A', 'B', 'C', 'D']
    all_texts = [correct_text] + wrong_texts[:3]  # Garantir 4 opções
    random.shuffle(all_texts)
    
    correct_idx = all_texts.index(correct_text)
    options = []
    for i, letter in enumerate(letters):
        options.append({"label": letter, "text": all_texts[i]})
    
    return {
        "question": question_text,
        "options": options,
        "correct": letters[correct_idx],
        "tip": tip,
        "interests": interests
    }

new_questions = []

# ========== PSICOLOGIA - 9 questões ==========
psicologia = [
    create_question(
        "Qual golpe é comum em sites de terapia online falsos?",
        "Cobrança por sessões de terapia com profissionais não qualificados ou inexistentes",
        ["Terapeutas certificados pelo CRP", "Sessões com sigilo profissional garantido", "Plano de tratamento personalizado"],
        "Golpistas criam sites de terapia online oferecendo sessões com profissionais que não são qualificados ou que nem existem, colocando em risco a saúde mental dos pacientes.",
        ["Psicologia", "Saúde e Bem-Estar", "Tecnologia"]
    ),
    create_question(
        "Que fraude ocorre em anúncios de cursos de psicologia online?",
        "Venda de cursos com certificados falsos que não são reconhecidos",
        ["Cursos com professores doutores", "Certificado reconhecido pelo MEC", "Aulas práticas presenciais"],
        "Fraudadores vendem cursos de psicologia prometendo certificados que não têm validade legal, enganando estudantes que investem tempo e dinheiro esperando qualificação profissional.",
        ["Psicologia", "Educação", "Tecnologia"]
    ),
    create_question(
        "Qual golpe é frequente na venda de testes psicológicos online?",
        "Venda de testes não validados ou com interpretações falsas",
        ["Testes validados cientificamente", "Interpretação por psicólogos", "Relatórios detalhados"],
        "Golpistas vendem testes psicológicos que não são validados cientificamente ou fornecem interpretações incorretas, podendo causar danos à saúde mental das pessoas.",
        ["Psicologia", "Saúde e Bem-Estar", "Tecnologia"]
    ),
    create_question(
        "Que tipo de fraude ocorre em apps de bem-estar mental?",
        "Cobrança por assinaturas de apps que não fornecem serviços reais de terapia",
        ["Apps com terapeutas certificados", "Sessões de terapia reais", "Acompanhamento profissional"],
        "Fraudadores criam apps de bem-estar mental que cobram assinaturas caras mas não fornecem serviços reais de terapia ou suporte adequado, enganando usuários vulneráveis.",
        ["Psicologia", "Saúde e Bem-Estar", "Tecnologia"]
    ),
    create_question(
        "Qual golpe é comum em grupos de apoio psicológico falsos?",
        "Cobrança de taxas para participar de grupos que não oferecem suporte real",
        ["Grupos gratuitos de apoio", "Moderadores profissionais", "Suporte 24 horas"],
        "Golpistas criam grupos de apoio psicológico falsos que cobram taxas de participação mas não oferecem suporte real ou moderadores qualificados, explorando pessoas em situação vulnerável.",
        ["Psicologia", "Saúde e Bem-Estar", "Tecnologia"]
    ),
    create_question(
        "Que fraude ocorre na venda de livros de autoajuda falsos?",
        "Venda de e-books com conteúdo plagiado ou promessas impossíveis",
        ["Livros de autores renomados", "Conteúdo original e testado", "Garantia de resultados"],
        "Fraudadores vendem livros de autoajuda com conteúdo plagiado ou promessas impossíveis de cumprir, enganando pessoas que buscam melhorar sua saúde mental.",
        ["Psicologia", "Leitura", "Desenvolvimento Pessoal"]
    ),
    create_question(
        "Qual golpe é frequente em anúncios de coaching psicológico?",
        "Venda de serviços de coaching por pessoas sem formação em psicologia",
        ["Coaching por psicólogos certificados", "Sessões estruturadas", "Acompanhamento profissional"],
        "Golpistas oferecem serviços de coaching psicológico sem ter formação adequada, colocando em risco a saúde mental dos clientes e cobrando por serviços não qualificados.",
        ["Psicologia", "Desenvolvimento Pessoal", "Empreendedorismo"]
    ),
    create_question(
        "Que tipo de fraude ocorre em sites de consulta psicológica grátis?",
        "Coleta de dados pessoais e informações sensíveis sem prestar serviço real",
        ["Consultas gratuitas reais", "Psicólogos voluntários", "Sigilo profissional garantido"],
        "Fraudadores criam sites que prometem consultas psicológicas gratuitas mas apenas coletam dados pessoais e informações sensíveis dos usuários, violando privacidade e não oferecendo serviço real.",
        ["Psicologia", "Tecnologia", "Saúde e Bem-Estar"]
    ),
    create_question(
        "Qual golpe é comum na venda de certificados de cursos de psicologia?",
        "Venda de certificados falsos sem necessidade de fazer o curso",
        ["Certificados após conclusão do curso", "Cursos reconhecidos pelo MEC", "Avaliação obrigatória"],
        "Golpistas vendem certificados de cursos de psicologia sem exigir que a pessoa faça o curso, colocando profissionais não qualificados no mercado e colocando pacientes em risco.",
        ["Psicologia", "Educação", "Tecnologia"]
    )
]
new_questions.extend(psicologia)
print(f"Adicionadas {len(psicologia)} questões de Psicologia")

# ========== CINEMA - 9 questões ==========
cinema = [
    create_question(
        "Qual golpe é comum na venda de ingressos de cinema online?",
        "Venda de ingressos falsificados ou já utilizados",
        ["Ingressos válidos para qualquer sessão", "Desconto garantido", "Troca facilitada"],
        "Golpistas vendem ingressos de cinema falsificados ou que já foram utilizados, deixando compradores sem acesso ao filme e sem o dinheiro investido.",
        ["Cinema", "Tecnologia", "Cultura Pop"]
    ),
    create_question(
        "Que fraude ocorre em sites de streaming pirata de filmes?",
        "Cobrança por assinaturas que não funcionam ou instalam vírus",
        ["Acesso a filmes originais", "Qualidade HD garantida", "Suporte técnico disponível"],
        "Fraudadores oferecem assinaturas de streaming pirata que não funcionam ou instalam malware nos dispositivos, colocando em risco a segurança dos usuários.",
        ["Cinema", "Tecnologia", "Cultura Pop"]
    ),
    create_question(
        "Qual golpe é frequente na venda de DVDs e Blu-rays falsificados?",
        "Venda de cópias piratas com qualidade inferior ou que não funcionam",
        ["Produtos originais lacrados", "Garantia do fabricante", "Extras e comentários do diretor"],
        "Golpistas vendem DVDs e Blu-rays falsificados que têm qualidade de imagem e som muito inferior ou que não funcionam em alguns aparelhos, enganando compradores que esperam receber produtos originais.",
        ["Cinema", "Tecnologia", "Cultura Pop"]
    ),
    create_question(
        "Que tipo de fraude ocorre em anúncios de cursos de cinema online?",
        "Venda de cursos com promessas de carreira que não são cumpridas",
        ["Cursos com professores renomados", "Certificado reconhecido", "Acesso vitalício ao conteúdo"],
        "Fraudadores vendem cursos de cinema prometendo oportunidades de carreira e conexões na indústria que nunca se materializam, enganando estudantes que investem tempo e dinheiro.",
        ["Cinema", "Educação", "Empreendedorismo"]
    ),
    create_question(
        "Qual golpe é comum em sites de venda de memorabilia de cinema?",
        "Venda de itens falsificados como autênticos de filmes famosos",
        ["Itens autenticados por especialistas", "Certificado de autenticidade", "História do item documentada"],
        "Golpistas vendem itens falsificados como se fossem memorabilia autêntica de filmes famosos, cobrando valores altos por itens que não têm valor real ou histórico.",
        ["Cinema", "Cultura Pop", "Tecnologia"]
    ),
    create_question(
        "Que fraude ocorre em anúncios de festivais de cinema falsos?",
        "Cobrança de taxas de inscrição para festivais que não existem",
        ["Festivais reconhecidos internacionalmente", "Júri de profissionais da indústria", "Premiação em dinheiro"],
        "Fraudadores criam festivais de cinema falsos e cobram taxas de inscrição de cineastas, desaparecendo sem realizar o evento prometido e deixando participantes sem o dinheiro investido.",
        ["Cinema", "Empreendedorismo", "Tecnologia"]
    ),
    create_question(
        "Qual golpe é frequente na venda de roteiros de filmes online?",
        "Venda de roteiros plagiados ou genéricos como originais",
        ["Roteiros originais protegidos por direitos autorais", "Feedback de profissionais", "Oportunidades de produção"],
        "Golpistas vendem roteiros de filmes que são plagiados de outros trabalhos ou roteiros genéricos como se fossem originais e únicos, enganando compradores que esperam conteúdo original.",
        ["Cinema", "Leitura", "Empreendedorismo"]
    ),
    create_question(
        "Que tipo de fraude ocorre em sites de crowdfunding para filmes?",
        "Arrecadação de dinheiro para projetos que nunca são realizados",
        ["Projetos com equipe comprovada", "Transparência total do orçamento", "Recompensas garantidas para apoiadores"],
        "Fraudadores criam campanhas de crowdfunding para filmes que nunca são produzidos, desaparecendo com o dinheiro arrecadado e deixando apoiadores sem o projeto prometido e sem reembolso.",
        ["Cinema", "Empreendedorismo", "Investimentos"]
    ),
    create_question(
        "Qual golpe é comum em anúncios de equipamentos de filmagem baratos?",
        "Venda de equipamentos com defeito ou de qualidade muito inferior",
        ["Equipamentos novos de fábrica", "Garantia do fabricante", "Suporte técnico disponível"],
        "Golpistas vendem equipamentos de filmagem com preços muito abaixo do mercado, mas enviam produtos com defeito ou de qualidade muito inferior, enganando cineastas que esperam equipamentos funcionais.",
        ["Cinema", "Fotografia", "Tecnologia"]
    )
]
new_questions.extend(cinema)
print(f"Adicionadas {len(cinema)} questões de Cinema")

# ========== SÉRIES DE TV - 9 questões ==========
series_tv = [
    create_question(
        "Qual golpe é comum na venda de assinaturas de streaming falsas?",
        "Venda de contas compartilhadas que são bloqueadas ou roubadas",
        ["Assinaturas oficiais com desconto", "Acesso garantido por 1 ano", "Suporte da plataforma"],
        "Golpistas vendem contas de streaming compartilhadas que são bloqueadas pela plataforma ou roubadas pelos vendedores, deixando compradores sem acesso e sem dinheiro.",
        ["Séries de TV", "Tecnologia", "Cultura Pop"]
    ),
    create_question(
        "Que fraude ocorre em sites de download de séries piratas?",
        "Distribuição de arquivos com vírus ou malware disfarçados de episódios",
        ["Downloads seguros e rápidos", "Qualidade HD garantida", "Sem necessidade de cadastro"],
        "Fraudadores distribuem arquivos que parecem ser episódios de séries mas contêm vírus ou malware, colocando em risco a segurança dos dispositivos dos usuários.",
        ["Séries de TV", "Tecnologia", "Cultura Pop"]
    ),
    create_question(
        "Qual golpe é frequente em grupos de compartilhamento de séries?",
        "Cobrança de taxas para acessar links que não funcionam ou expiram rapidamente",
        ["Compartilhamento gratuito entre fãs", "Links atualizados regularmente", "Qualidade garantida"],
        "Golpistas criam grupos que cobram taxas para acessar links de séries, mas os links não funcionam ou expiram rapidamente, deixando membros sem acesso ao conteúdo prometido.",
        ["Séries de TV", "Tecnologia", "Cultura Pop"]
    ),
    create_question(
        "Que tipo de fraude ocorre em anúncios de box sets de séries falsificados?",
        "Venda de box sets com DVDs de baixa qualidade ou incompletos",
        ["Box sets originais lacrados", "Todos os episódios incluídos", "Extras e comentários"],
        "Fraudadores vendem box sets de séries que contêm DVDs de qualidade muito inferior ou que estão incompletos, enganando colecionadores que esperam receber produtos originais completos.",
        ["Séries de TV", "Cultura Pop", "Tecnologia"]
    ),
    create_question(
        "Qual golpe é comum em sites de spoilers falsos?",
        "Criação de sites que cobram para ver spoilers que são informações falsas",
        ["Spoilers gratuitos e verificados", "Informações de fontes confiáveis", "Avisos antes de revelar"],
        "Golpistas criam sites que cobram para ver spoilers de séries, mas as informações são falsas ou inventadas, enganando fãs que pagam por conteúdo que não é real.",
        ["Séries de TV", "Cultura Pop", "Tecnologia"]
    ),
    create_question(
        "Que fraude ocorre em anúncios de eventos de séries falsos?",
        "Venda de ingressos para convenções ou eventos que nunca acontecem",
        ["Eventos oficiais com atores confirmados", "Ingressos com garantia de reembolso", "Programação divulgada antecipadamente"],
        "Fraudadores vendem ingressos para convenções ou eventos de séries que nunca são realizados, desaparecendo com o dinheiro dos fãs que esperam encontrar atores e outros fãs.",
        ["Séries de TV", "Cultura Pop", "Viagens"]
    ),
    create_question(
        "Qual golpe é frequente na venda de merchandising de séries falsificado?",
        "Venda de produtos não oficiais de baixa qualidade como se fossem oficiais",
        ["Produtos licenciados oficialmente", "Qualidade garantida pelo estúdio", "Embalagem original"],
        "Golpistas vendem produtos de merchandising de séries que não são oficiais e têm qualidade muito inferior, mas são anunciados como se fossem produtos licenciados oficiais.",
        ["Séries de TV", "Cultura Pop", "Moda"]
    ),
    create_question(
        "Que tipo de fraude ocorre em sites de ranking de séries falsos?",
        "Criação de sites que cobram para ver rankings manipulados ou falsos",
        ["Rankings baseados em dados reais", "Análise imparcial de críticos", "Acesso gratuito aos dados"],
        "Golpistas criam sites que cobram para ver rankings de séries, mas os rankings são manipulados ou completamente falsos, enganando usuários que pagam por informações que não são confiáveis.",
        ["Séries de TV", "Cultura Pop", "Tecnologia"]
    ),
    create_question(
        "Qual golpe é comum em anúncios de cursos sobre análise de séries?",
        "Venda de cursos com conteúdo de baixa qualidade ou plagiado",
        ["Cursos com críticos renomados", "Análise profunda e original", "Certificado de conclusão"],
        "Golpistas vendem cursos sobre análise de séries que contêm conteúdo de baixa qualidade ou plagiado de outros cursos, enganando estudantes que esperam aprender análise crítica.",
        ["Séries de TV", "Educação", "Cultura Pop"]
    )
]
new_questions.extend(series_tv)
print(f"Adicionadas {len(series_tv)} questões de Séries de TV")

# ========== ARQUITETURA - 7 questões ==========
arquitetura = [
    create_question(
        "Qual golpe é comum na venda de projetos arquitetônicos online?",
        "Venda de projetos plagiados de arquitetos famosos",
        ["Assinatura de revistas de arquitetura", "Curso presencial de desenho técnico", "Venda de materiais de construção"],
        "Golpistas vendem projetos arquitetônicos copiados de profissionais renomados, violando direitos autorais e enganando clientes que acreditam estar comprando projetos originais.",
        ["Arquitetura", "Design", "Tecnologia"]
    ),
    create_question(
        "Que fraude ocorre com frequência em sites de venda de plantas arquitetônicas?",
        "Venda de plantas genéricas como projetos personalizados",
        ["Entrega de projetos em formato PDF", "Consultoria gratuita de arquitetura", "Venda de softwares de arquitetura originais"],
        "Fraudadores vendem plantas arquitetônicas genéricas como se fossem projetos personalizados, cobrando valores altos por material que não atende às necessidades específicas do cliente.",
        ["Arquitetura", "Design", "Tecnologia"]
    ),
    create_question(
        "Qual golpe é frequente em anúncios de cursos online de arquitetura?",
        "Venda de cursos com certificados falsos ou inexistentes",
        ["Aulas presenciais de arquitetura", "Material didático impresso", "Tutoria individual garantida"],
        "Golpistas oferecem cursos de arquitetura online prometendo certificados que não são reconhecidos ou que nunca são entregues, enganando estudantes que investem tempo e dinheiro.",
        ["Arquitetura", "Educação", "Tecnologia"]
    ),
    create_question(
        "Que tipo de fraude ocorre na venda de softwares de arquitetura piratas?",
        "Venda de licenças falsas que param de funcionar após alguns dias",
        ["Software original com desconto", "Suporte técnico gratuito", "Atualizações automáticas"],
        "Criminosos vendem licenças falsas de softwares de arquitetura que funcionam temporariamente, mas param de funcionar após alguns dias, deixando o comprador sem o produto e sem o dinheiro investido.",
        ["Arquitetura", "Tecnologia", "Programação"]
    ),
    create_question(
        "Qual golpe é comum em sites de venda de maquetes arquitetônicas?",
        "Venda de maquetes com fotos falsas que não correspondem ao produto real",
        ["Maquetes personalizadas sob medida", "Entrega expressa garantida", "Material de alta qualidade"],
        "Fraudadores usam fotos de maquetes profissionais para anunciar produtos de baixa qualidade que não correspondem às imagens, enganando clientes que esperam receber maquetes detalhadas.",
        ["Arquitetura", "Design", "Tecnologia"]
    ),
    create_question(
        "Que fraude ocorre em anúncios de consultoria arquitetônica online?",
        "Cobrança antecipada sem prestar o serviço prometido",
        ["Consultoria gratuita inicial", "Arquitetos certificados", "Projetos aprovados pelo CREA"],
        "Golpistas cobram valores antecipados por consultoria arquitetônica e desaparecem sem fornecer o serviço, deixando clientes sem o dinheiro e sem a orientação profissional prometida.",
        ["Arquitetura", "Empreendedorismo", "Tecnologia"]
    ),
    create_question(
        "Qual golpe é frequente na venda de livros digitais sobre arquitetura?",
        "Venda de e-books com conteúdo copiado ou arquivos vazios",
        ["Livros físicos com frete grátis", "Biblioteca digital completa", "Acesso vitalício garantido"],
        "Fraudadores vendem e-books sobre arquitetura que contêm conteúdo plagiado ou são arquivos vazios, enganando compradores que esperam receber material educacional de qualidade.",
        ["Arquitetura", "Leitura", "Educação"]
    )
]
new_questions.extend(arquitetura)
print(f"Adicionadas {len(arquitetura)} questões de Arquitetura")

# ========== ARTESANATO - 7 questões ==========
artesanato = [
    create_question(
        "Qual golpe é comum na venda de materiais para artesanato online?",
        "Venda de materiais falsificados ou de qualidade inferior ao anunciado",
        ["Kits completos de artesanato", "Tutoriais em vídeo inclusos", "Garantia de satisfação"],
        "Golpistas vendem materiais para artesanato que não correspondem à qualidade anunciada, usando fotos de produtos originais para enganar artesãos que esperam receber materiais de boa qualidade.",
        ["Artesanato", "DIY (Faça Você Mesmo)", "Design"]
    ),
    create_question(
        "Que fraude ocorre em sites de venda de tutoriais de artesanato?",
        "Venda de tutoriais copiados de outros artesãos sem autorização",
        ["Aulas presenciais de artesanato", "Material didático impresso", "Certificado de conclusão"],
        "Fraudadores vendem tutoriais de artesanato que são cópias não autorizadas de conteúdo de outros artesãos, violando direitos autorais e enganando compradores.",
        ["Artesanato", "Educação", "DIY (Faça Você Mesmo)"]
    ),
    create_question(
        "Qual golpe é frequente em grupos de artesanato nas redes sociais?",
        "Venda de produtos artesanais com fotos falsas que não correspondem ao produto real",
        ["Produtos feitos à mão", "Entrega rápida garantida", "Suporte pós-venda"],
        "Golpistas usam fotos de produtos artesanais profissionais para vender itens de baixa qualidade ou produtos industrializados, enganando compradores que esperam receber artesanato autêntico.",
        ["Artesanato", "Design", "Tecnologia"]
    ),
    create_question(
        "Que tipo de fraude ocorre na venda de cursos online de artesanato?",
        "Cobrança por cursos que não são entregues ou têm conteúdo de baixa qualidade",
        ["Aulas ao vivo interativas", "Material incluso no curso", "Acesso vitalício à plataforma"],
        "Fraudadores cobram por cursos de artesanato que nunca são disponibilizados ou contêm conteúdo de baixa qualidade, deixando alunos sem o conhecimento prometido e sem o dinheiro investido.",
        ["Artesanato", "Educação", "Tecnologia"]
    ),
    create_question(
        "Qual golpe é comum em marketplaces de artesanato?",
        "Venda de produtos artesanais importados como se fossem nacionais",
        ["Produtos feitos por artesãos locais", "História do artesão incluída", "Suporte ao artesão local"],
        "Golpistas vendem produtos industrializados importados como se fossem artesanato nacional, enganando consumidores que querem apoiar artesãos locais e receber produtos autênticos.",
        ["Artesanato", "Empreendedorismo", "Tecnologia"]
    ),
    create_question(
        "Que fraude ocorre em anúncios de kits de artesanato com desconto?",
        "Venda de kits incompletos ou com materiais de qualidade inferior",
        ["Kits completos com todos os materiais", "Instruções detalhadas inclusas", "Garantia de qualidade"],
        "Fraudadores oferecem kits de artesanato com descontos atraentes, mas enviam kits incompletos ou com materiais de qualidade muito inferior ao anunciado, deixando compradores sem todos os itens necessários.",
        ["Artesanato", "DIY (Faça Você Mesmo)", "Tecnologia"]
    ),
    create_question(
        "Qual golpe é frequente na venda de padrões e moldes de artesanato?",
        "Venda de padrões copiados sem autorização ou arquivos corrompidos",
        ["Padrões originais e testados", "Suporte para dúvidas", "Atualizações de novos padrões"],
        "Golpistas vendem padrões e moldes de artesanato que são cópias não autorizadas de outros criadores ou arquivos que não podem ser abertos, enganando artesãos que precisam de moldes confiáveis.",
        ["Artesanato", "Design", "Tecnologia"]
    )
]
new_questions.extend(artesanato)
print(f"Adicionadas {len(artesanato)} questões de Artesanato")

# Continuar com os outros interesses...
# Por limitações de espaço, vou adicionar mais questões em lotes

print(f"\nTotal de questões novas criadas até agora: {len(new_questions)}")
print("Continuando com mais interesses...")

# Mesclar e salvar
all_questions = existing_questions + new_questions

with open('Scam/src/data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(all_questions, f, ensure_ascii=False, indent=2)

print(f"\n✅ Adicionadas {len(new_questions)} questões novas")
print(f"✅ Total de questões agora: {len(all_questions)}")
print(f"\n⚠️  Ainda faltam questões para outros interesses.")
print("Execute este script novamente após adicionar mais questões ao código.")

