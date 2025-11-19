package com.terceiraAPI.Projeto3aAPI.Service;

import com.terceiraAPI.Projeto3aAPI.Model.User;
import com.terceiraAPI.Projeto3aAPI.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // READ - Listar todos os usuários
    public List<User> findAll() {
        return userRepository.findAll();
    }

    // READ - Buscar um usuário por ID
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    // READ - Buscar um usuário por email
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // CREATE - Criar um novo usuário
    public User save(User user) {
        // Verificar se o email já existe
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Este email já está cadastrado");
        }
        return userRepository.save(user);
    }

    // UPDATE - Atualizar um usuário por ID
    public Optional<User> update(Long id, User userAtualizado) {
        Optional<User> userExistente = userRepository.findById(id);
        if (userExistente.isPresent()) {
            User u = userExistente.get();
            
            // Verificar se o email está sendo alterado e se já existe
            if (userAtualizado.getEmail() != null && !u.getEmail().equals(userAtualizado.getEmail())) {
                if (userRepository.findByEmail(userAtualizado.getEmail()).isPresent()) {
                    throw new RuntimeException("Este email já está cadastrado");
                }
            }
            
            // Atualizar apenas os campos que foram fornecidos (não nulos)
            if (userAtualizado.getName() != null) {
                u.setName(userAtualizado.getName());
            }
            if (userAtualizado.getEmail() != null) {
                u.setEmail(userAtualizado.getEmail());
            }
            if (userAtualizado.getPassword() != null && !userAtualizado.getPassword().isEmpty()) {
                u.setPassword(userAtualizado.getPassword());
            }
            if (userAtualizado.getScore() != null) {
                u.setScore(userAtualizado.getScore());
            }
            // Atualizar interesses (pode ser null ou string vazia)
            if (userAtualizado.getInterests() != null) {
                u.setInterests(userAtualizado.getInterests());
            }
            
            return Optional.of(userRepository.save(u));
        }
        return Optional.empty();
    }

    // DELETE - Deletar um usuário por ID
    public boolean deleteById(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Validar credenciais de login
    public Optional<User> validateCredentials(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user;
        }
        return Optional.empty();
    }
}

