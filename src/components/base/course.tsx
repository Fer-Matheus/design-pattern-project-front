"use client";
import { Users, Book, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { formatCurrency } from "../pages/checkout/validation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
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

  console.log("User type: ", user_type);

  return (
    <Card key={id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="mt-1">{instructor}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</p>

        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {studentsCount}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(price)}
              </span>
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
              className="w-full"
              onClick={() => {
                localStorage.setItem("courseId", id.toString());

                if (user_type === "S") {
                  router.push("/course/1");
                } else {
                  router.push("/create-lesson");
                }
              }}
            >
              <Book className="w-4 h-4 mr-2" />
              Acessar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
