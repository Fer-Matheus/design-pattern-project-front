import { getTokenFromCookies } from "@/lib/getToken";
import AxiosInstance from "@/providers/axios-instance";
import { CreateLessonRequest, CreateLessonResponse } from "@/shared/lesson-api";

// Instância do axios
const { provider: axiosInstance } = AxiosInstance({});

export class LessonService {
  private static instance: LessonService;
  private currentModuleId: number | null = null; // Context do módulo atual

  private constructor() {}

  public static getInstance(): LessonService {
    if (!LessonService.instance) {
      LessonService.instance = new LessonService();
    }
    return LessonService.instance;
  }

  /**
   * Define o contexto do módulo atual
   * @param moduleId - ID do módulo atual ou null para root
   */
  setCurrentModule(moduleId: number | null): void {
    this.currentModuleId = moduleId;
  }

  /**
   * Obtém o contexto do módulo atual
   */
  getCurrentModule(): number | null {
    return this.currentModuleId;
  }

  /**
   * Obtém a próxima ordem disponível para uma lesson
   * @param courseId - ID do curso
   * @param parentId - ID do módulo pai (opcional)
   * @returns Próximo número de ordem
   */
  private async getNextOrder(
    courseId: string | number,
    parentId?: number
  ): Promise<number> {
    try {
      const lessons = await this.getLessons(courseId);

      // Filtrar lessons do mesmo parent
      const sameLevelLessons = lessons.filter(
        (lesson) =>
          lesson.parent_id === parentId ||
          (lesson.parent_id === undefined && parentId === undefined)
      );

      if (sameLevelLessons.length === 0) {
        return 1;
      }

      // Retornar o maior order + 1
      const maxOrder = Math.max(...sameLevelLessons.map((l) => l.order));
      return maxOrder + 1;
    } catch (error) {
      // Se não conseguir buscar, começar do 1
      return 1;
    }
  }

  /**
   * Obtém o ID da lesson anterior (para prerequisite)
   * @param courseId - ID do curso
   * @param parentId - ID do módulo pai (opcional)
   * @returns ID da lesson anterior ou null
   */
  private async getPreviousLessonId(
    courseId: string | number,
    parentId?: number
  ): Promise<number | null> {
    try {
      const lessons = await this.getLessons(courseId);

      // Filtrar lessons do mesmo parent
      const sameLevelLessons = lessons.filter(
        (lesson) =>
          lesson.parent_id === parentId ||
          (lesson.parent_id === undefined && parentId === undefined)
      );

      if (sameLevelLessons.length === 0) {
        return null;
      }

      // Ordenar por order e pegar a última
      const sortedLessons = sameLevelLessons.sort((a, b) => a.order - b.order);
      const lastLesson = sortedLessons[sortedLessons.length - 1];

      return lastLesson.id;
    } catch (error) {
      return null;
    }
  }

  /**
   * Cria uma nova lesson em um curso com parent_id e prerequisite_id automáticos
   * @param courseId - ID do curso
   * @param lessonData - Dados da lesson a ser criada
   * @returns Promise com a lesson criada
   */
  async createLesson(
    courseId: string | number,
    lessonData: Omit<
      CreateLessonRequest,
      "parent_id" | "prerequisite_id" | "order"
    >
  ): Promise<CreateLessonResponse> {
    try {
      // Determinar parent_id automaticamente
      const parentId = this.currentModuleId || undefined;

      // Determinar order automaticamente
      const order = await this.getNextOrder(courseId, parentId);

      // Determinar prerequisite_id automaticamente
      const prerequisiteId = await this.getPreviousLessonId(courseId, parentId);

      const completeData: CreateLessonRequest = {
        ...lessonData,
      order: 3};

      const jwt = await getTokenFromCookies();

      console.log("JWT: ", jwt)

      console.log("course id: ", courseId)
      const response = await axiosInstance.post<
        CreateLessonRequest,
        CreateLessonResponse
      >(`/courses/${courseId}/lessons`, completeData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      console.log("depois da requisição")
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error ao criar lesson";
      throw new Error(errorMessage);
    }
  }

  /**
   * Cria uma lesson de vídeo
   * @param courseId - ID do curso
   * @param title - Título da lesson
   * @param description - Descrição da lesson
   * @param filePath - Caminho do arquivo de vídeo
   * @returns Promise com a lesson criada
   */
  async createVideoLesson(
    courseId: string | number,
    title: string,
    description: string,
    filePath: string
  ): Promise<CreateLessonResponse> {
    const lessonData = {
      title,
      description,
      lesson_type: "V" as const,
      file_path: filePath,
    };

    return this.createLesson(courseId, lessonData);
  }

  /**
   * Cria uma lesson de texto
   * @param courseId - ID do curso
   * @param title - Título da lesson
   * @param description - Descrição da lesson
   * @param filePath - Caminho do arquivo de texto
   * @returns Promise com a lesson criada
   */
  async createTextLesson(
    courseId: string | number,
    title: string,
    description: string,
    filePath: string
  ): Promise<CreateLessonResponse> {
    const lessonData = {
      title,
      description,
      lesson_type: "T" as const,
      file_path: filePath,
    };

    return this.createLesson(courseId, lessonData);
  }

  /**
   * Cria uma lesson de questão/quiz
   * @param courseId - ID do curso
   * @param title - Título da lesson
   * @param description - Descrição da lesson
   * @param quizData - Dados do quiz
   * @returns Promise com a lesson criada
   */
  async createQuestionLesson(
    courseId: string | number,
    title: string,
    description: string,
    quizData: any
  ): Promise<CreateLessonResponse> {
    const lessonData = {
      title,
      description,
      lesson_type: "Q" as const,
      quiz_data: quizData,
    };

    return this.createLesson(courseId, lessonData);
  }

  /**
   * Cria um módulo (conjunto de lessons)
   * @param courseId - ID do curso
   * @param title - Título do módulo
   * @param description - Descrição do módulo
   * @returns Promise com o módulo criado
   */
  async createModule(
    courseId: string | number,
    title: string,
    description: string
  ): Promise<CreateLessonResponse> {
    const lessonData = {
      title,
      description,
      lesson_type: "M" as const,
    };

    return this.createLesson(courseId, lessonData);
  }

  /**
   * Obtém todas as lessons de um curso
   * @param courseId - ID do curso
   * @returns Promise com array de lessons
   */
  async getLessons(courseId: string | number): Promise<CreateLessonResponse[]> {
    try {
      const response = await axiosInstance.get<CreateLessonResponse[]>(
        `/courses/${courseId}/lessons`
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao buscar lessons";
      throw new Error(errorMessage);
    }
  }

  /**
   * Atualiza uma lesson existente
   * @param courseId - ID do curso
   * @param lessonId - ID da lesson
   * @param lessonData - Dados atualizados da lesson
   * @returns Promise com a lesson atualizada
   */
  async updateLesson(
    courseId: string | number,
    lessonId: string | number,
    lessonData: Partial<CreateLessonRequest>
  ): Promise<CreateLessonResponse> {
    try {
      const response = await axiosInstance.put<CreateLessonResponse>(
        `/courses/${courseId}/lessons/${lessonId}`,
        lessonData
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao atualizar lesson";
      throw new Error(errorMessage);
    }
  }

  /**
   * Deleta uma lesson
   * @param courseId - ID do curso
   * @param lessonId - ID da lesson
   * @returns Promise void
   */
  async deleteLesson(
    courseId: string | number,
    lessonId: string | number
  ): Promise<void> {
    try {
      await axiosInstance.delete(`/courses/${courseId}/lessons/${lessonId}`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao deletar lesson";
      throw new Error(errorMessage);
    }
  }
}

// Instância singleton do serviço
export const lessonService = LessonService.getInstance();
