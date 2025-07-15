import { Course } from "@/shared/course";

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "React Avançado: Hooks e Context API",
    description:
      "Domine os conceitos avançados do React com hooks personalizados e gerenciamento de estado global com Context API. Aprenda a criar aplicações escaláveis e performáticas.",
    price: 199.9,
    originalPrice: 299.9,
    instructor: "João Silva",
    duration: "8 horas",
    level: "Avançado",
    image: "/api/placeholder/300/200",
    rating: 4.8,
    studentsCount: 1234,
    category: "React",
  },
  {
    id: "2",
    title: "Node.js e MongoDB: API REST Completa",
    description:
      "Crie APIs robustas e escaláveis com Node.js, Express e MongoDB. Aprenda autenticação, validação, testes e deploy em produção.",
    price: 149.9,
    originalPrice: 199.9,
    instructor: "Maria Santos",
    duration: "10 horas",
    level: "Intermediário",
    image: "/api/placeholder/300/200",
    rating: 4.9,
    studentsCount: 856,
    category: "Backend",
  },
  {
    id: "3",
    title: "TypeScript do Zero ao Avançado",
    description:
      "Aprenda TypeScript desde os fundamentos até conceitos avançados. Generics, decorators, módulos e integração com frameworks modernos.",
    price: 179.9,
    originalPrice: 229.9,
    instructor: "Carlos Oliveira",
    duration: "12 horas",
    level: "Iniciante",
    image: "/api/placeholder/300/200",
    rating: 4.7,
    studentsCount: 2341,
    category: "TypeScript",
  },
  {
    id: "4",
    title: "Next.js 14: Full Stack com App Router",
    description:
      "Domine o Next.js 14 com App Router, Server Components, Server Actions e todas as novidades do framework mais popular do React.",
    price: 249.9,
    originalPrice: 349.9,
    instructor: "Ana Costa",
    duration: "15 horas",
    level: "Intermediário",
    image: "/api/placeholder/300/200",
    rating: 4.9,
    studentsCount: 1876,
    category: "Next.js",
  },
  {
    id: "5",
    title: "Vue.js 3: Composition API e Pinia",
    description:
      "Aprenda Vue.js 3 com Composition API, Pinia para gerenciamento de estado e as melhores práticas para desenvolvimento moderno.",
    price: 169.9,
    originalPrice: 219.9,
    instructor: "Pedro Martins",
    duration: "9 horas",
    level: "Intermediário",
    image: "/api/placeholder/300/200",
    rating: 4.6,
    studentsCount: 743,
    category: "Vue.js",
  },
  {
    id: "6",
    title: "Python para Data Science e Machine Learning",
    description:
      "Mergulhe no mundo da ciência de dados com Python, pandas, numpy, scikit-learn e criação de modelos de machine learning.",
    price: 299.9,
    originalPrice: 399.9,
    instructor: "Dr. Lucas Ferreira",
    duration: "20 horas",
    level: "Avançado",
    image: "/api/placeholder/300/200",
    rating: 4.8,
    studentsCount: 3021,
    category: "Python",
  },
];

export const getRandomCourses = (count: number = 3): Course[] => {
  const shuffled = [...mockCourses].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getCourseById = (id: string): Course | undefined => {
  return mockCourses.find((course) => course.id === id);
};

export const getCoursesByCategory = (category: string): Course[] => {
  return mockCourses.filter((course) => course.category === category);
};
