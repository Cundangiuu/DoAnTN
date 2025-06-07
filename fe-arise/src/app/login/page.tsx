import LoginButton from "./component/LoginButton";
import UtilsWrapper from "./component/UtilsWrapper";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Login({ searchParams }: Readonly<Props>) {
  const props = await searchParams;
  const error = props ? props["error"] : undefined;

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-[#0083c1] to-[#19d3c5]">
      <UtilsWrapper error={typeof error === "string" ? error : undefined} />
      <div className="max-w-screen-md w-full h-auto xl:w-1/2 bg-white rounded-md shadow-lg p-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold uppercase text-black mt-4">
          Sign In
        </h1>
        <div className="w-full flex-grow flex flex-col items-center mt-4">
          <LoginButton redirect={props?.redirect as string | undefined} />
        </div>
      </div>
    </div>
  );
}
