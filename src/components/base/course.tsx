"use client";
import { Users, Book, ShoppingCart, PlayCircle, Award } from "lucide-react";
import { Button } from "../ui/button";
import { formatCurrency } from "../pages/checkout/validation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

interface CourseProps {
  user_type?: string;
  id: number;
  title: string;
  instructor?: string;
  description?: string;
  studentsCount?: number;
  price: number;
  source: string;
}

export default function Course({
  id,
  title,
  instructor,
  description,
  studentsCount,
  price,
  user_type,
  source,
}: CourseProps) {
  const router = useRouter();

  // Determinar se é um curso adquirido pelo aluno
  const isOwnedByStudent = source === "H" && user_type === "S";

  return (
    <Card
      key={id}
      className={`hover:shadow-lg transition-all duration-300 ${
        isOwnedByStudent
          ? "border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50"
          : "hover:shadow-lg transition-shadow"
      }`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{title}</CardTitle>
              {isOwnedByStudent && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 text-xs"
                >
                  <Award className="w-3 h-3 mr-1" />
                  Adquirido
                </Badge>
              )}
            </div>
            <CardDescription className="mt-1">{instructor}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {description}
          </p>
        )}

        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{studentsCount || 0}</span>
          </div>
          {isOwnedByStudent && (
            <div className="flex items-center text-green-600">
              <PlayCircle className="w-4 h-4 mr-1" />
              <span className="text-xs font-medium">Disponível</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <span
                className={`text-lg font-bold ${
                  isOwnedByStudent ? "text-green-600" : "text-green-600"
                }`}
              >
                {formatCurrency(price)}
              </span>
              {isOwnedByStudent && (
                <p className="text-xs text-green-600 mt-1">✓ Pago</p>
              )}
            </div>
          </div>

          {source === "CP" ? (
            <Button
              className="w-full"
              onClick={() => {
                localStorage.setItem("courseId", id.toString());

                if (user_type === "S") {
                  router.push("/checkout");
                } else {
                  router.push("/");
                }
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Comprar
            </Button>
          ) : (
            <Button
              className={`w-full ${
                isOwnedByStudent
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : ""
              }`}
              onClick={() => {
                localStorage.setItem("courseId", id.toString());

                if (user_type === "S") {
                  router.push("/course/1");
                } else {
                  router.push("/create-lesson");
                }
              }}
            >
              {isOwnedByStudent ? (
                <>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Continuar Estudos
                </>
              ) : (
                <>
                  <Book className="w-4 h-4 mr-2" />
                  Acessar
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
