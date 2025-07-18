
import { CreateCourse } from "@/components/base/createCourse";
import Courses from "@/components/layout/data-table/myCourses";
import { getTokenFromCookies } from "@/lib/getToken";
import { getUserCourses, getUserData } from "@/service/auth";

export default async function Home() {
  const jwt = await getTokenFromCookies();

  const data = await getUserData(jwt!);

  const role = data?.user_type == "S" ? "aluno" : "professor";

  const myData = role === "aluno" ? await getUserCourses(jwt!) : null;

  return (
    <section>
      <div className="flex items-end">
        <h1 className="text-xl">Bem vindo,</h1>
      </div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">
          {data?.first_name} {data?.last_name}
        </h1>
        {role === "professor" ? <CreateCourse /> : null}
      </div>

      {role === "professor" ? (
        <div>
          <h1 className="pt-10">Segue os cursos que você é professor</h1>
          <div className="w-full flex justify-center items-center">
            <Courses courses={data.courses_teaching} user_type={data.user_type}/>
          </div>
        </div>
      ) : null}

      {role === "aluno" ? (
        <div>
          <h1 className="pt-10">Segue os cursos que você possui como aluno</h1>
          <div className="w-full flex justify-center items-center">
            <Courses courses={myData?.items!} user_type={data.user_type}/>
          </div>
        </div>
      ) : null}
    </section>
  );
}
