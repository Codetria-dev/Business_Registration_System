# Sistema de Cadastro de Empresas

Sistema completo de cadastro e gerenciamento de empresas com funcionalidades CRUD (Create, Read, Update, Delete), busca e ordenação.

## O que faz

Este sistema permite:
- **Cadastrar** novas empresas com nome, email e telefone
- **Listar** todas as empresas cadastradas
- **Buscar** empresas por nome ou email (busca parcial)
- **Editar** dados de empresas existentes
- **Excluir** empresas com confirmação

## Para quem serve

- Empresas que precisam gerenciar um cadastro de clientes/fornecedores
- Organizações que precisam manter um registro de empresas parceiras
- Qualquer pessoa que precise de um sistema simples de cadastro e consulta

## Tecnologias Utilizadas

- **Backend**: Python 3 + Flask
- **Banco de Dados**: SQLite
- **Frontend**: HTML5 + CSS3 + JavaScript (Vanilla)
- **ORM**: SQLAlchemy

## Como rodar

### Pré-requisitos

- Python 3.7 ou superior instalado
- pip (gerenciador de pacotes Python)

### Passo a passo

1. **Clone ou baixe o projeto**

2. **Instale as dependências**

   Abra o terminal na pasta do projeto e execute:
   ```bash
   pip install -r requirements.txt
   ```

3. **Execute a aplicação**

   ```bash
   python app.py
   ```

4. **Acesse no navegador**

   Abra seu navegador e acesse:
   ```
   http://localhost:5000
   ```

### Estrutura do Projeto

```
Business_Registration_System/
│
├── app.py                 # Aplicação Flask principal
├── models.py              # Modelos de dados (SQLAlchemy)
├── requirements.txt       # Dependências Python
├── README.md             # Este arquivo
│
├── templates/
│   └── index.html        # Interface HTML
│
└── static/
    ├── style.css         # Estilos CSS
    └── script.js         # Lógica JavaScript
```

## Funcionalidades Detalhadas

### 1. Cadastro
- Formulário com campos: Nome, Email, Telefone
- Validação de campos obrigatórios
- Validação de formato de email
- Verificação de email duplicado

### 2. Listagem
- Exibe todas as empresas cadastradas
- Informações organizadas e claras
- Ordenação por ID ou Nome

### 3. Busca
- Busca por nome ou email
- Busca parcial (contém)
- Atualização em tempo real

### 4. Edição
- Edição de dados existentes
- Mantém validações do cadastro
- Interface intuitiva

### 5. Exclusão
- Confirmação antes de excluir
- Modal de confirmação
- Feedback visual

## Banco de Dados

O banco de dados SQLite (`businesses.db`) é criado automaticamente na primeira execução. A tabela `business` contém:
- `id`: Identificador único (chave primária)
- `name`: Nome da empresa
- `email`: Email (único)
- `phone`: Telefone

## API Endpoints

- `GET /api/businesses` - Lista empresas (com suporte a `?search=` e `?order_by=`)
- `POST /api/businesses` - Cria nova empresa
- `PUT /api/businesses/<id>` - Atualiza empresa
- `DELETE /api/businesses/<id>` - Exclui empresa

## Observações

- O banco de dados é criado automaticamente na primeira execução
- O modo debug está ativado por padrão (desative em produção)
- Todos os dados são persistidos no arquivo `businesses.db`

## Desenvolvimento

Para desenvolvimento, certifique-se de ter um ambiente virtual Python ativado e instale as dependências:

```bash
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Licença

Este projeto é de código aberto e está disponível para uso livre.
