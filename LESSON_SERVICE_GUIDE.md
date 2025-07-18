# Serviço de Lessons - Documentação (Atualizada)

## Visão Geral

O serviço de lessons foi criado para gerenciar a criação, edição e exclusão de lessons em cursos com **automação completa** para `parent_id`, `prerequisite_id` e `order`. O instrutor só precisa definir o conteúdo, enquanto o sistema gerencia automaticamente a estrutura e dependências.

## Estrutura da API

### Endpoint Principal

```
POST /courses/{course_id}/lessons
```

### Estrutura da Requisição (Simplificada)

```json
{
  "title": "string",
  "description": "string",
  "lesson_type": "V" | "T" | "Q" | "M",
  "file_path": "string", // Opcional - para vídeos e textos
  "quiz_data": {
    "question": "string",
    "options": ["string"],
    "correctAnswer": number
  } // Opcional - para questões
  // parent_id, prerequisite_id e order são definidos automaticamente
}
```

## Automação do Sistema

### 🔄 **Campos Automáticos**

1. **`order`**: Calculado automaticamente baseado na sequência de criação
2. **`parent_id`**: Definido pelo contexto atual (se estiver criando dentro de um módulo)
3. **`prerequisite_id`**: Automaticamente definido como a lesson anterior na mesma estrutura

### 🎯 **Contexto de Módulo**

O serviço mantém um contexto do módulo atual:

- **Root (null)**: Lessons criadas no nível raiz do curso
- **Módulo específico**: Lessons criadas dentro de um módulo

## Como Usar

### 1. Importar o Hook

```typescript
import { useLesson } from "@/components/hooks/useLesson";
```

### 2. Usar no Componente

```typescript
const {
  createVideoLesson,
  createTextLesson,
  createQuestionLesson,
  createModule,
  setCurrentModule, // Novo método para definir contexto
  loading,
  error,
} = useLesson();
```

### 3. Exemplos de Uso (Simplificados)

#### Criar uma Lesson de Vídeo

```typescript
const handleCreateVideoLesson = async () => {
  try {
    const result = await createVideoLesson(
      1, // courseId
      "Introdução ao JavaScript", // title
      "Aprenda os conceitos básicos do JavaScript", // description
      "/videos/intro-js.mp4" // filePath
      // Não precisa mais de order, parentId, prerequisiteId
    );
    console.log("Lesson criada:", result);
  } catch (error) {
    console.error("Erro:", error);
  }
};
```

#### Criar uma Lesson de Texto

```typescript
const handleCreateTextLesson = async () => {
  try {
    const result = await createTextLesson(
      1, // courseId
      "Sintaxe Básica", // title
      "Aprenda a sintaxe básica do JavaScript", // description
      "/texts/sintaxe-basica.md" // filePath
      // Sistema automaticamente define order=2 e prerequisite_id=1
    );
  } catch (error) {
    console.error("Erro:", error);
  }
};
```

#### Criar uma Lesson de Questão

```typescript
const handleCreateQuestionLesson = async () => {
  try {
    const quizData = {
      question: "Qual é a saída do código: console.log(typeof null)?",
      options: ["null", "undefined", "object", "string"],
      correctAnswer: 2,
      explanation: "Em JavaScript, typeof null retorna 'object'.",
    };

    const result = await createQuestionLesson(
      1, // courseId
      "Quiz: Tipos de Dados", // title
      "Teste seus conhecimentos sobre tipos de dados", // description
      quizData // quizData
      // Sistema automaticamente define order=3 e prerequisite_id=2
    );
  } catch (error) {
    console.error("Erro:", error);
  }
};
```

#### Criar um Módulo e Lessons dentro dele

```typescript
const handleCreateModuleAndLessons = async () => {
  try {
    // 1. Criar módulo
    const module = await createModule(
      1, // courseId
      "Fundamentos do JavaScript", // title
      "Módulo introdutório sobre JavaScript" // description
    );

    // 2. Definir contexto do módulo
    setCurrentModule(module.id);

    // 3. Criar lessons dentro do módulo
    await createVideoLesson(
      1,
      "Introdução",
      "Vídeo introdutório",
      "/videos/intro.mp4"
    );

    await createTextLesson(
      1,
      "Conceitos Básicos",
      "Texto sobre conceitos",
      "/texts/conceitos.md"
    );

    // 4. Voltar ao contexto raiz
    setCurrentModule(null);
  } catch (error) {
    console.error("Erro:", error);
  }
};
```

## Fluxo de Trabalho Recomendado

### 📋 **Cenário 1: Curso Linear (sem módulos)**

```typescript
// Todas as lessons são criadas no nível raiz
setCurrentModule(null);

await createVideoLesson(1, "Aula 1", "Intro", "/videos/1.mp4");
await createTextLesson(1, "Aula 2", "Conceitos", "/texts/2.md");
await createQuestionLesson(1, "Quiz 1", "Teste", quizData);
```

**Resultado automático:**

- Lesson 1: order=1, prerequisite_id=null
- Lesson 2: order=2, prerequisite_id=1
- Lesson 3: order=3, prerequisite_id=2

### 📋 **Cenário 2: Curso com Módulos**

```typescript
// Criar módulo
const module1 = await createModule(1, "Módulo 1", "Fundamentos");
setCurrentModule(module1.id);

// Lessons dentro do módulo
await createVideoLesson(1, "Aula 1.1", "Intro", "/videos/1-1.mp4");
await createTextLesson(1, "Aula 1.2", "Conceitos", "/texts/1-2.md");

// Voltar ao nível raiz
setCurrentModule(null);

// Criar outro módulo
const module2 = await createModule(1, "Módulo 2", "Avançado");
setCurrentModule(module2.id);

await createVideoLesson(1, "Aula 2.1", "Avançado", "/videos/2-1.mp4");
```

**Resultado automático:**

- Módulo 1: order=1, prerequisite_id=null
- Lesson 1.1: order=1, parent_id=module1.id, prerequisite_id=null
- Lesson 1.2: order=2, parent_id=module1.id, prerequisite_id=lesson1.1.id
- Módulo 2: order=2, prerequisite_id=module1.id
- Lesson 2.1: order=1, parent_id=module2.id, prerequisite_id=null

## Vantagens da Automação

### ✅ **Para o Instrutor**

- **Simplicidade**: Foca apenas no conteúdo, não na estrutura
- **Rapidez**: Menos campos para preencher
- **Consistência**: Sistema garante ordem lógica
- **Flexibilidade**: Pode alternar entre módulos facilmente

### ✅ **Para o Sistema**

- **Integridade**: Garante que a ordem é sempre consistente
- **Manutenção**: Facilita reorganização automática
- **Escalabilidade**: Suporta estruturas complexas
- **Confiabilidade**: Evita erros manuais

## Arquivos Atualizados

- `/src/shared/lesson-api.ts` - Interfaces da API
- `/src/service/lesson/index.ts` - Serviço com automação
- `/src/components/hooks/useLesson.ts` - Hook simplificado
- `/src/components/pages/create-lesson-form.tsx` - Formulário simplificado
- `/src/app/create-lesson/page.tsx` - Página de exemplo

## Exemplo Prático - Formulário

O formulário agora é muito mais simples:

```tsx
// Campos obrigatórios apenas:
- Título
- Descrição
- Tipo (V/T/Q/M)
- Caminho do arquivo (só para V/T)

// Campos removidos (automáticos):
- Ordem ❌
- ID do módulo pai ❌
- ID do pré-requisito ❌
```

Teste o sistema na página `/create-lesson` para ver a automação funcionando! 🚀
