"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import loginSchema from "@/schema/loginSchema";
import { useRouter } from "next/navigation";
import {
  useLazyGetProfileQuery,
  useLoginEmployeeMutation,
} from "@/store/features/employeeSlice";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUserProfile } from "@/store/userSlice";

function LoginPage() {
  const dispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [login] = useLoginEmployeeMutation();
  const [getProfile] = useLazyGetProfileQuery();

  const onSubmit = async (data) => {
    console.log("Form Submitted:", data);
    setIsLoading(true);

    try {
      const loginRes = await login(data).unwrap();

      if (loginRes.success) {
        toast.success(loginRes.message || "Logged In Successfully");
        const profileRes = await getProfile().unwrap();

        if (profileRes.success) {
          dispatch(setUserProfile(profileRes));
          localStorage.setItem("userProfile", JSON.stringify(profileRes));
          localStorage.setItem("isAuthenticated", "true");

          reset();
          router.replace("/dashboard");
        } else {
          throw new Error(profileRes.message || "Failed to fetch profile");
        }
      } else {
        throw new Error(loginRes.message || "Login failed");
      }
    } catch (error) {
      console.log("err0r", error);

      toast.error(error?.data?.message || "Something went wrong");

      localStorage.removeItem("userProfile");
      localStorage.removeItem("isAuthenticated");
    } finally {
      setIsLoading(false);
    }
  };

  // console.log("form values", getValues(), "from err", errors);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-blue-500 via-purple-500 to-pink-500  p-4">
      <Card className="w-full max-w-sm bg-slate-100 opacity-98 shadow-lg">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          {/* <CardAction>
            <Button variant="link" onClick={() => router.push("/register")}>
              Sign Up
            </Button>
          </CardAction> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" required={true}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" required={true}>
                    Password
                  </Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <div className="flex relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {isPasswordVisible ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <CardFooter className="flex-col gap-2 mt-6">
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
