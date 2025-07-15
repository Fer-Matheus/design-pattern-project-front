# Página de Checkout - Learnfy

Esta é uma página de checkout completa construída com Next.js 15, TypeScript e Tailwind CSS, seguindo as melhores práticas de desenvolvimento e usando componentes do shadcn/ui.

## ✨ Recursos Implementados

### 🛒 Carrinho de Compras

- **Exibição de cursos**: Mostra todos os cursos adicionados ao carrinho
- **Informações detalhadas**: Título, instrutor, duração, avaliação, número de alunos
- **Preços e descontos**: Exibe preço original e preço com desconto
- **Remoção de itens**: Botão para remover cursos do carrinho
- **Persistência**: Carrinho é salvo no localStorage

### 💳 Métodos de Pagamento

- **Cartão de Crédito**: Formulário completo com validação
- **Cartão de Débito**: Formulário completo com validação
- **PIX**: Opção de pagamento instantâneo

### 🔍 Validação de Dados

- **Validação em tempo real**: Feedback imediato para o usuário
- **Formatação automática**: Número do cartão e data de validade
- **Validação de CVV**: Verificação do código de segurança
- **Validação de data**: Verificação de validade do cartão

### 🎨 Interface e UX

- **Design responsivo**: Funciona em desktop e mobile
- **Componentes reutilizáveis**: Baseados no shadcn/ui
- **Estados de loading**: Indicadores visuais durante processamento
- **Modal de confirmação**: Confirmação da compra com detalhes

## 🚀 Como Usar

### Acessando a Página

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Acessar a página de checkout
http://localhost:3000/checkout
```

### Estrutura dos Arquivos

```
src/
├── app/
│   └── checkout/
│       └── page.tsx                 # Página principal do checkout
├── components/
│   ├── pages/
│   │   ├── checkout-page.tsx        # Componente principal
│   │   └── checkout/
│   │       └── validation.ts        # Validações e formatações
│   ├── hooks/
│   │   └── useCart.ts              # Hook para gerenciar carrinho
│   └── ui/
│       ├── payment-icon.tsx         # Ícones de pagamento
│       ├── dialog.tsx              # Modal de confirmação
│       ├── select.tsx              # Seletor de métodos
│       ├── badge.tsx               # Badges informativos
│       └── separator.tsx           # Separadores visuais
├── providers/
│   └── cart-provider.tsx           # Contexto do carrinho
├── service/
│   └── cart/
│       └── index.ts                # Serviços do carrinho
└── shared/
    ├── course.ts                   # Tipos TypeScript
    └── mock-courses.ts             # Dados de exemplo
```

## 🎯 Funcionalidades Principais

### 1. Gerenciamento de Carrinho

```typescript
// Adicionar ao carrinho
addToCart(course: Course)

// Remover do carrinho
removeFromCart(courseId: string)

// Limpar carrinho
clearCart()

// Obter total
getTotal()
```

### 2. Processamento de Pagamento

```typescript
// Validar dados do cartão
validatePaymentData()

// Processar pagamento
handleCheckout()

// Formatar número do cartão
formatCardNumber(value: string)
```

### 3. Métodos de Pagamento Suportados

#### Cartão de Crédito/Débito

- Número do cartão (formatação automática)
- Nome do portador
- Data de validade (MM/AA)
- CVV

#### PIX

- Pagamento instantâneo
- Código gerado automaticamente

## 🔧 Configuração

### Dependências Necessárias

```json
{
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-select": "^1.2.2",
  "@radix-ui/react-separator": "^1.0.3",
  "lucide-react": "^0.525.0",
  "zod": "^3.25.75"
}
```

### Componentes shadcn/ui Utilizados

- `dialog` - Modal de confirmação
- `select` - Seletor de métodos de pagamento
- `badge` - Badges informativos
- `separator` - Separadores visuais
- `button` - Botões de ação
- `card` - Cards de conteúdo
- `input` - Campos de entrada
- `label` - Labels dos campos

## 📱 Responsividade

A página é totalmente responsiva e se adapta a:

- **Desktop**: Layout com 3 colunas
- **Tablet**: Layout com 2 colunas
- **Mobile**: Layout de coluna única

## 🎨 Temas e Estilização

### Cores Utilizadas

- **Primária**: Azul (`blue-600`)
- **Secundária**: Cinza (`gray-600`)
- **Sucesso**: Verde (`green-600`)
- **Erro**: Vermelho (`red-500`)
- **Aviso**: Amarelo (`yellow-500`)

### Componentes Customizados

- **CourseCard**: Card do curso com informações completas
- **PaymentIcon**: Ícones dos métodos de pagamento
- **PaymentMethodBadge**: Badge com tipo de pagamento

## 🔒 Segurança

### Validações Implementadas

- Validação de número do cartão
- Validação de data de validade
- Validação de CVV
- Sanitização de inputs
- Validação de campos obrigatórios

### Boas Práticas

- Não armazenamento de dados sensíveis
- Validação client-side e server-side
- Formatação segura de dados
- Tratamento de erros

## 🧪 Testes

### Dados de Teste

```typescript
// Cartão de teste
Número: 4111 1111 1111 1111
Nome: João Silva
Validade: 12/25
CVV: 123
```

### Cenários de Teste

- ✅ Adicionar/remover cursos do carrinho
- ✅ Validação de campos obrigatórios
- ✅ Formatação automática de dados
- ✅ Processamento de pagamento
- ✅ Modal de confirmação
- ✅ Persistência do carrinho

## 📄 Licença

Este projeto está sob a licença MIT.
