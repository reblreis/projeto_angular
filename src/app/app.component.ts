import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  mensagem_autenticar: string = '';
  mensagem_criarconta: string = '';
  mensagem_recuperarsenha: string = '';

  isLoggedIn: boolean = false;

  nomeUsuario: string = '';
  emailUsuario: string = '';

  ngOnInit(): void {
    if (localStorage.getItem('dados-usuario') != null) {
      var dados = JSON.parse(localStorage.getItem('dados-usuario') as string);
      this.nomeUsuario = dados.usuario.nome;
      this.emailUsuario = dados.usuario.email;
      this.isLoggedIn = true;
    }
  }

  constructor(
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService
  ) {

  }

  //criando um objeto para capturar os
  //campos do formulário de criação de usuário
  formCriarConta = new FormGroup({
    nome: new FormControl('', []), //campo 'nome'
    email: new FormControl('', []), //campo 'email'
    senha: new FormControl('', []) //campo 'senha'
  });

  //criando um objeto para capturar os
  //campos do formulário de autenticação
  formAutenticar = new FormGroup({
    email: new FormControl('', []), //campo 'email'
    senha: new FormControl('', []) //campo 'senha'
  });

  //criando um objeto para capturar os
  //campos do formulário de recuperação de senha
  formRecuperarSenha = new FormGroup({
    email: new FormControl('', []), //campo 'email'
  });

  //função para capturar o SUBMIT do formulário
  criarConta(): void {

    this.spinner.show();

    this.mensagem_autenticar = '';
    this.mensagem_criarconta = '';
    this.mensagem_recuperarsenha = '';

    //capturando os valores preenchidos no formulário
    var dados = this.formCriarConta.value;
    //executando a chamada para a API
    this.httpClient.post(environment.apiUsuarios + 'api/criar-conta', dados)
      .subscribe({ //capturando a resposta da API
        next: (data: any) => { //sucesso!
          this.mensagem_criarconta = data.mensagem;
          this.formCriarConta.reset(); //limpar o formulário
        },
        error: (e) => { //erro!
          if (e.error.mensagem) {
            this.mensagem_criarconta = e.error.mensagem;
          }
          else if (e.error.errors) {
            this.mensagem_criarconta = e.error.errors;
          }
        }
      }).add(
        () => {
          this.spinner.hide();
        }
      );
  }

  //função para capturar o SUBMIT do formulário
  autenticar(): void {

    this.spinner.show();

    this.mensagem_autenticar = '';
    this.mensagem_criarconta = '';
    this.mensagem_recuperarsenha = '';

    //capturando os valores preenchidos no formulário
    var dados = this.formAutenticar.value;
    //executando a chamada para a API
    this.httpClient.post(environment.apiUsuarios + 'api/autenticar', dados)
      .subscribe({ //capturando a resposta da API
        next: (data: any) => { //sucesso!
          localStorage.setItem('dados-usuario', JSON.stringify(data));
          window.location.href = "/admin-clientes";
        },
        error: (e) => { //erro!
          this.mensagem_autenticar = e.error.mensagem;
        }
      }).add(
        () => {
          this.spinner.hide();
        }
      );
  }

  //função para capturar o SUBMIT do formulário
  recuperarSenha(): void {

    this.spinner.show();

    this.mensagem_autenticar = '';
    this.mensagem_criarconta = '';
    this.mensagem_recuperarsenha = '';

    //capturando os valores preenchidos no formulário
    var dados = this.formRecuperarSenha.value;
    //executando a chamada para a API
    this.httpClient.post(environment.apiUsuarios + 'api/recuperar-senha', dados)
      .subscribe({ //capturando a resposta da API
        next: (data: any) => { //sucesso!
          this.mensagem_recuperarsenha = data.mensagem;
        },
        error: (e) => { //erro!
          this.mensagem_recuperarsenha = e.error.mensagem;
        }
      }).add(
        () => {
          this.spinner.hide();
        }
      );
  } 
}
