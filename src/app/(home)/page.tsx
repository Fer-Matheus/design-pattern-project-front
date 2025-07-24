import { CreateCourse } from "@/components/base/createCourse";
import Courses from "@/components/layout/data-table/myCourses";
import CourseProgress from "@/components/layout/course-progress";
import { getTokenFromCookies } from "@/lib/getToken";
import { getUserCourses, getUserData } from "@/service/auth";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Clock } from "lucide-react";

export default async function Home() {

  const data = await getUserData();

  const role = data?.user_type == "S" ? "aluno" : "professor";

  let myData = null;

  if (role === "aluno") {
    try {
      myData = await getUserCourses();
    } catch (error) {
      console.error("Erro ao carregar cursos do aluno:", error);
    }
  }

  return (
    <section className="space-y-8">
      {/* Header de Boas-vindas */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg p-6">
        <div className="flex items-end mb-2">
          <h1 className="text-xl text-gray-700">Bem vindo de volta,</h1>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.first_name} {data?.last_name}
          </h1>
          {role === "professor" && <CreateCourse />}
        </div>
        <p className="text-gray-600 mt-2">
          {role === "aluno"
            ? "Continue seus estudos e explore novos conhecimentos!"
            : "Gerencie seus cursos e compartilhe conhecimento!"}
        </p>
      </div>

      {/* Dashboard para Professores */}
      {role === "professor" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Seus Cursos como Professor
            </h2>
          </div>

          <div className="w-full">
            <Courses
              courses={data.courses_teaching}
              user_type={data.user_type}
            />
          </div>
        </div>
      )}

      {/* Dashboard para Alunos */}
      {role === "aluno" && (
        <div className="space-y-6">
          {/* Header dos Cursos */}
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {myData?.items && myData.items.length > 0
                ? "Meus Cursos Adquiridos"
                : "Biblioteca de Cursos"}
            </h2>
          </div>

          {/* Resumo dos Cursos (apenas se houver cursos) */}
          {myData?.items && myData.items.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">
                  Continue seus estudos
                </h3>
              </div>
              <p className="text-blue-700">
                Você tem {myData.items.length}{" "}
                {myData.items.length === 1
                  ? "curso disponível"
                  : "cursos disponíveis"}{" "}
                 para continuar aprendendo. Clique em "Acessar" para retomar onde
                parou!
              </p>
            </div>
          )}

          {/* Exibição dos Cursos */}
          {myData?.items && myData.items.length > 0 ? (
            <div className="space-y-6">

              {/* Grid de Cursos */}
              <Courses courses={myData.items} user_type={data.user_type} />
            </div>
          ) : (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Nenhum curso adquirido ainda
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Explore nossa biblioteca de cursos e comece sua jornada de
                  aprendizado hoje mesmo!
                </p>
                <a
                  href="/courses"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Explorar Cursos
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </section>
  );
}
