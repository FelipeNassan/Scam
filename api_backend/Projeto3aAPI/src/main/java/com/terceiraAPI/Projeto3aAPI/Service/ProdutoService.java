package com.terceiraAPI.Projeto3aAPI.Service;

import com.terceiraAPI.Projeto3aAPI.Model.Produto;
import com.terceiraAPI.Projeto3aAPI.Repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    // READ - Listar todos os produtos
    public List<Produto> findAll() {
        return produtoRepository.findAll();
    }

    // READ - Buscar um produto por ID
    public Optional<Produto> findById(Long id) {
        return produtoRepository.findById(id);
    }

    // CREATE - Criar um novo produto
    public Produto save(Produto produto) {
        return produtoRepository.save(produto);
    }

    // UPDATE - Atualizar um produto por ID
    public Optional<Produto> update(Long id, Produto produtoAtualizado) {
        Optional<Produto> produtoExistente = produtoRepository.findById(id);
        if (produtoExistente.isPresent()) {
            Produto p = produtoExistente.get();
            p.setNome(produtoAtualizado.getNome());
            p.setPreco(produtoAtualizado.getPreco());
            return Optional.of(produtoRepository.save(p));
        }
        return Optional.empty();
    }

    // DELETE - Deletar um produto por ID
    public boolean deleteById(Long id) {
        if (produtoRepository.existsById(id)) {
            produtoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}