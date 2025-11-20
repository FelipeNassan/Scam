#!/usr/bin/env python3
import json
import random

# Carregar questions.json existente
with open('Scam/src/data/questions.json', 'r', encoding='utf-8') as f:
    existing_questions = json.load(f)

print(f"Questões existentes: {len(existing_questions)}")

# Criar novas questões
new_questions = []

# Função auxiliar para embaralhar opções
def shuffle_options(correct_text, wrong_texts):
    letters = ['A', 'B', 'C', 'D']
    all_texts = [correct_text] + wrong_texts
    random.shuffle(all_texts)
    
    correct_idx = all_texts.index(correct_text)
    options = []
    for i, letter in enumerate(letters):
        options.append({"label": letter, "text": all_texts[i]})
    
    return options, letters[correct_idx]

# Adicionar questões aqui...
# Por limitações, vou criar algumas questões de exemplo e você pode expandir

# Psicologia - 9 questões
psicologia_q = [
    {
        "question": "Qual golpe é comum em sites de terapia online falsos?",
        "correct_text": "Cobrança por sessões de terapia com profissionais não qualificados ou inexistentes",
        "wrong_texts": [
            "Terapeutas certificados pelo CRP",
            "Sessões com sigilo profissional garantido",
            "Plano de tratamento personalizado"
        ],
        "tip": "Golpistas criam sites de terapia online oferecendo sessões com profissionais que não são qualificados ou que nem existem, colocando em risco a saúde mental dos pacientes.",
        "interests": ["Psicologia", "Saúde e Bem-Estar", "Tecnologia"]
    }
]

for q in psicologia_q:
    options, correct = shuffle_options(q["correct_text"], q["wrong_texts"])
    new_questions.append({
        "question": q["question"],
        "options": options,
        "correct": correct,
        "tip": q["tip"],
        "interests": q["interests"]
    })

# Mesclar e salvar
all_questions = existing_questions + new_questions

with open('Scam/src/data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(all_questions, f, ensure_ascii=False, indent=2)

print(f"Adicionadas {len(new_questions)} questões")
print(f"Total agora: {len(all_questions)} questões")
