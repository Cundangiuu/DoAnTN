import { auth } from "@/auth";
import TabClass from "./components/TabsClass";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session) {
    return (
      <div className="p-4 text-center bg-[#f0f4f8] h-screen flex items-center justify-center">
        <div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Chưa xác thực
          </h1>
          <p className="text-gray-700">
            Vui lòng đăng nhập để truy cập trang này.
          </p>
        </div>
      </div>
    );
  }

  const roles = session.roles ?? [];

  return (
    <div className="bg-[#f0f4f8] min-h-screen">
      <TabClass roles={roles.map((r) => r.name)}>{children}</TabClass>
    </div>
  );
}