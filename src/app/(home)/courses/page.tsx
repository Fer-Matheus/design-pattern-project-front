import { CartProvider } from "@/providers/cart-provider";
import { getAllCourses, getUserCourses, getUserData } from "@/service/auth";
import Course from "@/components/base/course";

export default async function CoursesPage() {

  const userData = await getUserData();

  const userCourses = await getUserCourses();

  console.log("Dados do usuario: ", userData);

  const allCourses = await getAllCourses();

  console.log(allCourses)
  console.log(userCourses.items)

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
              userCourses={ userCourses.items.includes(course) }
              source="CP"
            />
          ))}
        </div>
        {/* <CoursesDemo/> */}
      </CartProvider>
    </div>
  );
}
