# Ambiente

## Preparando o ambiente

### Opção - Executando em ambiente Docker Orquestrador Rabbit MQ
- Passo 1: Execute RABBIT MQ docker run -d --hostname my-rabbit --name rabbit13 -p 8080:15672 -p 5672:5672 -p 25676:25676 rabbitmq:3-management
- Passo 2: Execute POSTGRESS docker run -p 5432:5432 -v /tmp/database:/var/lib/postgresql/data -e POSTGRES_PASSWORD=1234 postgres
- Passo 3: Execute os microserviços cart, payment, order com os seguintes comandos, npm run install, npm run build e npm run dev
- Passo 4: Com o postman importe fiap_restaurante.postman_collection.json
> Aplicação disponivel na porta 8000, 5000 e 3000 e servidor do Rabbit MQ para visualização das filas http://localhost:8080/#/queues

### Opção - Executando na AWS
## Provisionando a Infra AWS
- Passo 1: Clone o repositório com os arquivos do TERRAFORM https://github.com/jessicasalmeida/infra_hackaton
- Passo 2: Altere as credencias e as roles no arquivo .vars
- Passo 3: Execute os seguintes com comandos, terraform init, terraform plan, terrafom apply -auto-approve infra será provisionada na AWS
## Upload das imagens
- Passo 1: Clone os projetos dos microserviços: https://github.com/jessicasalmeida/health_schedule, https://github.com/jessicasalmeida/health_paciente e https://github.com/jessicasalmeida/health_med
- Execute os seguintes comandos em microserviço, ja clonado: npm run install e npm run build.
- Passo 2: Configure as credencias da AWS em "C:\Users\XX\.aws\credentials"
- Passo 3: Build a imagem dos microserviços para cada um deles. Ex: docker build . -t medico:latest
- Passo 4: Faça upload ads imagens para aws em todos os microserviços com os seguintes comandos:
  - aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin XXX.dkr.ecr.us-east-1.amazonaws.com/medico
  - docker tag payment:latest XXX.dkr.ecr.us-east-1.amazonaws.com/medico:latest
  - docker push XXX.dkr.ecr.us-east-1.amazonaws.com/medico:latest
- Passo 5: Projeto disponivel na AWS
- Passo 6: Copie a URL da API Gateway para ter acesso a aplicação

### Links DOCs
- Desenho Arquitetura: https://github.com/jessicasalmeida/health_schedule/blob/main/docs/Arquitetura%20AWS.png
- Collection: https://github.com/jessicasalmeida/health_schedule/blob/main/docs/health.postman_collection.json
- Video: https://youtu.be/K5IB4d1KSpQ

# Dados das APIs

## Login

- Login Paciente: 
   - Endpoint: /loginpaciente
     > Exemplo:
     {
       "username": "paciente@paciente.com",
       "password": "Fase!324"
      }
- Login Medico: 
   - Endpoint: /loginmedico
     > Exemplo:
     {
       "username": "paciente@medico.com",
       "password": "Fase!324"
      }
     
## Doutor

- Criar Doutor: 
   - Endpoint: /doctor/
    > Exemplo:
     {
        "_id": "006",
        "name": "Jessica",
        "cpf": "000.000.000-00",
        "crm": "123456789",
        "email": "jess@hotmail.com",
        "password": "Techchallenge@24"
      }

- Criar horarios: 
   - Endpoint: /doctor/schedule
   > Exemplo:
      [{
        "id": "001",
        "doctorId": "001",
        "patientId": "",
        "date": "27/09/2024 20:01",
        "status": "false"
      }]

- Editar Agenda: 
   - Endpoint: /doctor/editSchedule/:id
   > Exemplo: /doctor/editSchedule/66f731eff6fca2d21456f359
     {
        "id": "001",
        "doctorId": "001",
        "patientId": "",
        "date": "23/09/2024 10:30",
        "status": "true"
      }
   
- Listar Agenda: 
   - Endpoint: /doctor/appointments/:id
   > Exemplo: /doctor/appointments/001
## Paciente
- Novo Paciete: 
   - Endpoint: /paciente/
   > Exemplo:
   {
        "_id": "001",
        "name": "Jessica",
        "cpf": "000.000.000-00",
        "email": "jess@hotmail.com",
        "password": "123456"
   }

- Listar Doutores: 
   - Endpoint: /paciente/listDoctors

- Listar Agenda do Doutor: 
   - Endpoint: /paciente/appointments/:id
   >Exemplo:
   paciente/appointments/001

- Reservar um horario: 
   - Endpoint: /paciente/reserve?idPaciente=id&idAppointment=id
   > Exemplo:
    paciente/reserve?idPaciente=001&idAppointment=66f73cb421b6658a5c077129
