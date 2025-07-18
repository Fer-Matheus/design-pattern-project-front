import Course from "@/components/base/course";
import { IncommingCourses } from "@/shared/course";

interface CoursesProps {
  courses: IncommingCourses[];
  user_type: string;
};
export default function Courses({ courses, user_type }: CoursesProps) {
  console.log(courses);

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {courses.map((courses) => (
        <Course
          key={courses.id}
          id={courses.id}
          title={courses.title}
          price={courses.price}
          studentsCount={courses.students_enrolled}
          user_type={user_type}
          source="H"
        />
      ))}
    </div>
  );
}
