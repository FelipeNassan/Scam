package com.terceiraAPI.Projeto3aAPI.Controller;

import com.terceiraAPI.Projeto3aAPI.Model.QuizAttempt;
import com.terceiraAPI.Projeto3aAPI.Service.QuizAttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/quiz-attempts")
public class QuizAttemptController {
    
    @Autowired
    private QuizAttemptService quizAttemptService;

    // READ - Listar todas as tentativas
    @GetMapping
    public List<QuizAttempt> getAllQuizAttempts() {
        return quizAttemptService.findAll();
    }

    // READ - Buscar uma tentativa por ID
    @GetMapping("/{id}")
    public ResponseEntity<QuizAttempt> getQuizAttemptById(@PathVariable Long id) {
        Optional<QuizAttempt> quizAttempt = quizAttemptService.findById(id);
        return quizAttempt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // READ - Buscar todas as tentativas de um usuário
    @GetMapping("/user/{userId}")
    public List<QuizAttempt> getQuizAttemptsByUserId(@PathVariable Long userId) {
        return quizAttemptService.findByUserId(userId);
    }

    // CREATE - Criar uma nova tentativa
    @PostMapping
    public QuizAttempt createQuizAttempt(@RequestBody QuizAttempt quizAttempt) {
        return quizAttemptService.save(quizAttempt);
    }

    // UPDATE - Atualizar uma tentativa por ID
    @PutMapping("/{id}")
    public ResponseEntity<QuizAttempt> updateQuizAttempt(@PathVariable Long id, @RequestBody QuizAttempt quizAttemptAtualizado) {
        Optional<QuizAttempt> quizAttempt = quizAttemptService.update(id, quizAttemptAtualizado);
        return quizAttempt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE - Deletar uma tentativa por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuizAttempt(@PathVariable Long id) {
        if (quizAttemptService.deleteById(id)) {
            return ResponseEntity.ok("Tentativa deletada com sucesso!");
        }
        return ResponseEntity.notFound().build();
    }
}

