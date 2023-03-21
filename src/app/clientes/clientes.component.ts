import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  isLoggedIn: boolean = false;

  nomeUsuario: string = '';
  emailUsuario: string = '';

  clientes: any[] = [];

  httpHeaders: HttpHeaders = new HttpHeaders();

  mensagem_cadastro: string = '';
  mensagem_exclusao: string = '';
  mensagem_edicao: string = '';

  constructor(
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService
  ) {
  }

  formCadastro = new FormGroup({
    nome: new FormControl('', []),
    email: new FormControl('', []),
    telefone: new FormControl('', []),
    cpf: new FormControl('', [])
  });

  formEdicao = new FormGroup({
    idCliente: new FormControl('', []),
    nome: new FormControl('', []),
    email: new FormControl('', []),
    telefone: new FormControl('', []),
    cpf: new FormControl('', [])
  });

  ngOnInit(): void {
    if (localStorage.getItem('dados-usuario') != null) {
      var dados = JSON.parse(localStorage.getItem('dados-usuario') as string);
      this.nomeUsuario = dados.usuario.nome;
      this.emailUsuario = dados.usuario.email;
      this.isLoggedIn = true;

      this.httpHeaders = new HttpHeaders({
        'Authorization': `Bearer ${dados.token}`
      })

      this.consultarClientes();
    }
    else {
      window.location.href = '';
    }
  }

  consultarClientes(): void {

    this.spinner.show();

    this.httpClient.get(environment.apiClientes + 'api/clientes', {
      headers: this.httpHeaders
    })
      .subscribe(
        (data) => {
          this.clientes = data as any[];
        }
      ).add(
        () => {
          this.spinner.hide();
        }
      );
  }

  cadastrarCliente(): void {

    this.spinner.show();

    this.httpClient.post(environment.apiClientes + 'api/clientes',
      this.formCadastro.value, { headers: this.httpHeaders })
      .subscribe({
        next: (data: any) => {
          this.mensagem_cadastro = data.mensagem;
          this.formCadastro.reset();
          this.consultarClientes();
        },
        error: (e) => {
          this.mensagem_cadastro = e.error.mensagem;
        }
      }).add(
        () => {
          this.spinner.hide();
        }
      );
  }

  excluirCliente(idCliente: number): void {

    if (window.confirm('Deseja realmente excluir o cliente selecionado?')) {
      this.spinner.show();

      this.httpClient.delete(environment.apiClientes + 'api/clientes/' + idCliente,
        { headers: this.httpHeaders })
        .subscribe({
          next: (data: any) => {
            this.mensagem_exclusao = data.mensagem;
            this.consultarClientes();
          },
          error: (e) => {
            this.mensagem_exclusao = e.error.mensagem;
          }
        }).add(
          () => {
            this.spinner.hide();
          }
        );
    }
  }

  obterCliente(idCliente: number): void {

    this.spinner.show();

    this.httpClient.get(environment.apiClientes + 'api/clientes/' + idCliente,
      { headers: this.httpHeaders })
      .subscribe({
        next: (data: any) => {
          this.formEdicao.patchValue(data);
        },
        error: (e) => {
          console.log(e.error);
        }
      }).add(
        () => {
          this.spinner.hide();
        }
      );
  }

  atualizarCliente(): void {

    this.spinner.show();

    this.httpClient.put(environment.apiClientes + 'api/clientes/',
      this.formEdicao.value, { headers: this.httpHeaders })
      .subscribe({
        next: (data: any) => {
          this.mensagem_edicao = data.mensagem;
          this.consultarClientes();
        },
        error: (e) => {
          console.log(e.error);
        }
      }).add(
        () => {
          this.spinner.hide();
        }
      );
  }

  logout(): void {
    if (window.confirm('Deseja realmente sair do sistema?')) {
      localStorage.removeItem('dados-usuario');
      window.location.href = '';
    }
  }
}
