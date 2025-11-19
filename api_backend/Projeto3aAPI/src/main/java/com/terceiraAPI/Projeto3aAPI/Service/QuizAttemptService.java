package com.terceiraAPI.Projeto3aAPI.Service;

import com.terceiraAPI.Projeto3aAPI.Model.QuizAttempt;
import com.terceiraAPI.Projeto3aAPI.Repository.QuizAttemptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuizAttemptService {

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    // READ - Listar todas as tentativas
    public List<QuizAttempt> findAll() {
        return quizAttemptRepository.findAll();
    }

    // READ - Buscar uma tentativa por ID
    public Optional<QuizAttempt> findById(Long id) {
        return quizAttemptRepository.findById(id);
    }

    // READ - Buscar todas as tentativas de um usuário
    public List<QuizAttempt> findByUserId(Long userId) {
        return quizAttemptRepository.findByUserIdOrderByCompletedAtDesc(userId);
    }

    // CREATE - Criar uma nova tentativa
    public QuizAttempt save(QuizAttempt quizAttempt) {
        return quizAttemptRepository.save(quizAttempt);
    }

    // UPDATE - Atualizar uma tentativa por ID
    public Optional<QuizAttempt> update(Long id, QuizAttempt quizAttemptAtualizado) {
        Optional<QuizAttempt> quizAttemptExistente = quizAttemptRepository.findById(id);
        if (quizAttemptExistente.isPresent()) {
            QuizAttempt qa = quizAttemptExistente.get();
            qa.setUserId(quizAttemptAtualizado.getUserId());
            qa.setScore(quizAttemptAtualizado.getScore());
            qa.setTotalQuestions(quizAttemptAtualizado.getTotalQuestions());
            qa.setPercentage(quizAttemptAtualizado.getPercentage());
            return Optional.of(quizAttemptRepository.save(qa));
        }
        return Optional.empty();
    }

    // DELETE - Deletar uma tentativa por ID
    public boolean deleteById(Long id) {
        if (quizAttemptRepository.existsById(id)) {
            quizAttemptRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

