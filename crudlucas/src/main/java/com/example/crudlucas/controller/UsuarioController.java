package com.example.crudlucas.controller;

import com.example.crudlucas.model.Usuario;
import com.example.crudlucas.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import java.util.Optional;

@RestController
@RequestMapping(value = "/api/usuarios")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class UsuarioController {
    @Autowired
    UsuarioService usuarioService;

    @PostMapping(value = "/cadastrar")
    public ResponseEntity<Usuario> cadastrarUsuario(@RequestBody Usuario usuario){
        usuario = usuarioService.cadastrarUsuario(usuario);

        return ResponseEntity.ok().body(usuario);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Usuario> buscarUsuario(@PathVariable Long id){
        Optional<Usuario> usuario = usuarioService.buscarUsuario(id);

        if (usuario.isPresent()){
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(value = "/listar")
    public ResponseEntity <List<Usuario>> listarUsuarios(){
        List<Usuario> usuarios = usuarioService.listAll();
        return ResponseEntity.ok(usuarios);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(@RequestBody Usuario usuario, @PathVariable Long id){
        Optional<Usuario> user = usuarioService.buscarUsuario(id);

        if (user.isPresent()){

            Usuario updatedUser = usuarioService.atualizarUsuario(usuario, id).get();
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> deleteCliente(@PathVariable Long id){
        Optional<Usuario> usuario = usuarioService.buscarUsuario(id);

        if (usuario.isPresent()){
            usuarioService.deletarUsuario(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
