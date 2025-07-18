import { CartProvider } from "@/providers/cart-provider";
import { getAllCourses, getUserData } from "@/service/auth";
import { getTokenFromCookies } from "@/lib/getToken";
import Course from "@/components/base/course";
import CoursesDemo from "@/components/pages/courses-demo";

export default async function CoursesPage() {
  const jwt = await getTokenFromCookies();

  const userData = await getUserData(jwt!);

  console.log("Dados do usuario: ", userData);

  const allCourses = await getAllCourses(jwt!);

  return (
    <div>
      <CartProvider>
        <h1 className="text-2xl">Catálogo de cursos</h1>
        <div className="pt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allCourses.map((course, index) => (
            <Course
              key={index}
              id={course.id}
              price={course.price}
              title={course.title}
              user_type={userData.user_type}
              source="CP"
            />
          ))}
        </div>
        {/* <CoursesDemo/> */}
      </CartProvider>
    </div>
  );
}
