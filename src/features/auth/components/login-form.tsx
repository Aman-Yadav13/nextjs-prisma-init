import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export const LoginForm = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="flex h-[50vh] w-full items-center justify-center bg-emerald-600"></div>

      <div className="h-[50vh] w-full bg-slate-50" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-60 w-100 shadow-lg bg-white z-10 py-4 rounded-lg">
        <div className="flex flex-col items-center gap-4 h-full">
          <p className="text-center text-3xl font-semibold text-slate-800">
            Sign In
          </p>
          <p className="text-2xl text-slate-700">Use your Google Account</p>
          <form
            className="w-full px-16 mt-auto pb-10"
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/u/dashboard" });
            }}
          >
            <Button
              type="submit"
              className="bg-white border w-full flex items-center"
              variant="secondary"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              <span className="font-medium">Google</span>
            </Button>
          </form>
        </div>
      </div>

      <div className="absolute bottom-8 w-full text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
          Saviynt
        </span>
      </div>
    </div>
  );
};
