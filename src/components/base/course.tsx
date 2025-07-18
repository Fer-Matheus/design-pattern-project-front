import { Users, Book } from "lucide-react";
import { Button } from "../ui/button";
import { formatCurrency } from "../pages/checkout/validation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface CourseProps {
  id: number;
  title: string;
  instructor?: string;
  description?: string;
  studentsCount?: number;
  price: number;
}

export default function Course({
  id,
  title,
  instructor,
  description,
  studentsCount,
  price,
}: CourseProps) {
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

          <Button className="w-full">
            <Book className="w-4 h-4 mr-2" />
            Acessar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
