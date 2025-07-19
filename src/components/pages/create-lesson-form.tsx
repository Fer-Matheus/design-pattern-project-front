"use client";
import { useState, useEffect } from "react";
import { useLesson } from "@/components/hooks/useLesson";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, Upload, Video, BookOpen } from "lucide-react";
import { createLesson, getLessons } from "@/service/auth";
import { getTokenFromCookies } from "@/lib/getToken";
import { CreateLessonRequest } from "@/shared/lesson-api";

export function CreateLessonForm() {
  const id =
    typeof window !== "undefined" ? localStorage.getItem("courseId") : null;

  const [courseId, setCourseId] = useState(id!);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lessonType, setLessonType] = useState<
    "video" | "text" | "question" | "module"
  >("video");
  const [videoUrl, setVideoUrl] = useState("");
  const [filePath, setFilePath] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "advanced"
  >("beginner");
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados para estatísticas
  const [lessonStats, setLessonStats] = useState({
    video: 0,
    text: 0,
    question: 0,
    module: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Função para buscar lições e calcular estatísticas
  const fetchLessonStats = async () => {
    if (!courseId) return;

    try {
      setStatsLoading(true);
      const token = await getTokenFromCookies();
      if (!token) {
        setError("Token de autenticação não encontrado");
        return;
      }

      const response = await getLessons(token, courseId.toString());

      if (response && Array.isArray(response)) {
        const stats = response.reduce(
          (acc, lesson) => {
            // Mapear os tipos da API para os tipos locais
            let lessonType = lesson.lesson_type;
            if (lessonType === "V") lessonType = "video";
            else if (lessonType === "T") lessonType = "text";
            else if (lessonType === "Q") lessonType = "question";
            else if (lessonType === "M") lessonType = "module";

            if (lessonType && acc.hasOwnProperty(lessonType)) {
              acc[lessonType as keyof typeof acc]++;
            }
            return acc;
          },
          { video: 0, text: 0, question: 0, module: 0 }
        );
        setLessonStats(stats);
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas das lições:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Buscar estatísticas quando o componente montar ou courseId mudar
  useEffect(() => {
    fetchLessonStats();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    let lessonTypeExpectedOnServer = "";

    switch (lessonType) {
      case "video":
        lessonTypeExpectedOnServer = "V";
        break;
      case "question":
        lessonTypeExpectedOnServer = "Q";
        break;
      case "text":
        lessonTypeExpectedOnServer = "T";
        break;
      case "module":
        lessonTypeExpectedOnServer = "M";
        break;

      default:
        break;
    }

    try {
      const jwt = await getTokenFromCookies();
      await createLesson(jwt!, courseId, {
        title,
        description,
        lesson_type: lessonTypeExpectedOnServer,
        order: 1,
      });

      // Limpar formulário
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setFilePath("");
      setDuration("");
      setTags("");

      setMessage("Lesson criada com sucesso!");

      // Recarregar estatísticas após criar a lição
      await fetchLessonStats();
    } catch (error) {
      setError("Erro ao criar lesson. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-3">🎓 Criar Nova Lesson</h1>
        <p className="text-gray-600 text-lg">
          Adicione conteúdo educacional ao seu curso
        </p>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <Video className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium text-blue-700">Vídeos</p>
            <p className="text-2xl font-bold text-blue-800">
              {statsLoading ? "..." : lessonStats.video}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-medium text-green-700">Textos</p>
            <p className="text-2xl font-bold text-green-800">
              {statsLoading ? "..." : lessonStats.text}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <p className="text-sm font-medium text-orange-700">Questões</p>
            <p className="text-2xl font-bold text-orange-800">
              {statsLoading ? "..." : lessonStats.question}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium text-purple-700">Módulos</p>
            <p className="text-2xl font-bold text-purple-800">
              {statsLoading ? "..." : lessonStats.module}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Formulário Principal */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Upload className="h-6 w-6" />
            Detalhes da Lesson
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="courseId" className="text-sm font-medium">
                  ID do Curso *
                </Label>
                <Input
                  id="courseId"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  placeholder="Ex: 1, 2, 3..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lessonType" className="text-sm font-medium">
                  Tipo de Lesson *
                </Label>
                <Select
                  value={lessonType}
                  onValueChange={(
                    value: "video" | "text" | "question" | "module"
                  ) => setLessonType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700"
                        >
                          V
                        </Badge>
                        <Video className="h-4 w-4" />
                        <span>Lesson de Vídeo</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="text">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700"
                        >
                          T
                        </Badge>
                        <Upload className="h-4 w-4" />
                        <span>Lesson de Texto</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="question">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-700"
                        >
                          Q
                        </Badge>
                        <CheckCircle className="h-4 w-4" />
                        <span>Lesson de Questão</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="module">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700"
                        >
                          M
                        </Badge>
                        <BookOpen className="h-4 w-4" />
                        <span>Módulo</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Título *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Introdução ao React"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Descrição *
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o conteúdo desta lesson..."
                required
                rows={4}
              />
            </div>

            {/* Campos específicos por tipo */}
            {lessonType === "video" && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Configurações de Vídeo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">URL do Vídeo *</Label>
                    <Input
                      id="videoUrl"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://exemplo.com/video.mp4"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração (opcional)</Label>
                    <Input
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="Ex: 15:30"
                    />
                  </div>
                </div>
              </div>
            )}

            {lessonType === "text" && (
              <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Configurações de Texto
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="filePath">Caminho do Arquivo *</Label>
                  <Input
                    id="filePath"
                    value={filePath}
                    onChange={(e) => setFilePath(e.target.value)}
                    placeholder="caminho/para/arquivo.md"
                    required
                  />
                </div>
              </div>
            )}

            {lessonType === "question" && (
              <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-800 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Configurações de Questão
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Dificuldade</Label>
                    <Select
                      value={difficulty}
                      onValueChange={(
                        value: "beginner" | "intermediate" | "advanced"
                      ) => setDifficulty(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">🟢 Iniciante</SelectItem>
                        <SelectItem value="intermediate">
                          🟡 Intermediário
                        </SelectItem>
                        <SelectItem value="advanced">🔴 Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="react, javascript, frontend"
                    />
                  </div>
                </div>
              </div>
            )}

            {lessonType === "module" && (
              <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Configurações de Módulo
                </h3>
                <p className="text-sm text-purple-700">
                  Um módulo é um conjunto de lessons que serão agrupadas. Após
                  criar o módulo, você pode adicionar lessons dentro dele.
                </p>
              </div>
            )}

            {/* Mensagens de feedback */}
            {message && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 font-medium">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription className="font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Botão de submit */}
            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Criando lesson...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Criar{" "}
                  {lessonType === "video"
                    ? "Lesson de Vídeo"
                    : lessonType === "text"
                      ? "Lesson de Texto"
                      : lessonType === "question"
                        ? "Lesson de Questão"
                        : "Módulo"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
