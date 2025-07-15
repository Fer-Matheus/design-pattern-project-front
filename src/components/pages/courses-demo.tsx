"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, ShoppingCart } from "lucide-react";
import { mockCourses } from "@/shared/mock-courses";
import { useCart } from "@/providers/cart-provider";
import { formatCurrency } from "@/components/pages/checkout/validation";
import Link from "next/link";

export default function CoursesDemo() {
  const { addToCart, getItemCount } = useCart();

  const handleAddToCart = (course: any) => {
    addToCart(course);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cursos Disponíveis
          </h1>
          <p className="text-gray-600">
            Adicione cursos ao carrinho e vá para o checkout
          </p>

          <div className="mt-4 flex justify-center space-x-4">
            <Link href="/checkout">
              <Button className="flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Ir para Checkout ({getItemCount()})
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {course.instructor}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{course.level}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {course.studentsCount}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {course.rating}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      {course.originalPrice && (
                        <span className="text-sm text-gray-500 line-through mr-2">
                          {formatCurrency(course.originalPrice)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(course.price)}
                      </span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {course.category}
                    </Badge>
                  </div>

                  <Button
                    onClick={() => handleAddToCart(course)}
                    className="w-full"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
