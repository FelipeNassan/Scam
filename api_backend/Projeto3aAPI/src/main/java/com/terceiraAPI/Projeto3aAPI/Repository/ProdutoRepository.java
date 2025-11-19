package com.terceiraAPI.Projeto3aAPI.Repository;

import com.terceiraAPI.Projeto3aAPI.Model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    // Não precisa escrever métodos básicos - o JpaRepository já fornece:
    // save(), findAll(), findById(), deleteById(), etc.
}