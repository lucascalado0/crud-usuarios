package com.example.crudlucas.service;

import com.example.crudlucas.model.Usuario;
import com.example.crudlucas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    UsuarioRepository usuarioRepository;

    public Usuario cadastrarUsuario(Usuario usuario){

        if (usuario.getNome() == null || usuario.getSobrenome() == null || usuario.getEmail() == null ||
        usuario.getTelefone() == null){
            throw new  NullPointerException("Verifique os campos!");
        }

        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listAll(){
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarUsuario(Long id){
        Optional<Usuario> usuario = usuarioRepository.findById(id);

        if (usuario.isPresent()){
            return usuario;
        } else {
            throw new NoSuchElementException("Usuario inexistente!");
        }
    }

    public Optional<Usuario> atualizarUsuario(Usuario usuario, Long id){
        Optional<Usuario> user = usuarioRepository.findById(id);

        if (user.isPresent()){
            Usuario usuarioAtualizado = user.get();

            usuarioAtualizado.setEmail(usuario.getEmail());
            usuarioAtualizado.setTelefone(usuario.getTelefone());

            return Optional.of(usuarioRepository.save(usuarioAtualizado));
        } else {
            throw new NoSuchElementException("Usuario nao encontrado!");
        }
    }

    public Optional<Usuario> deletarUsuario(Long id){
        Optional<Usuario> usuario = usuarioRepository.findById(id);

        if (usuario.isPresent()){
            Usuario user = usuario.get();

            usuarioRepository.delete(user);

            return Optional.of(user);
        }

        else {
            throw new NoSuchElementException("Usuario nao encontrado!");
        }
    }

}
