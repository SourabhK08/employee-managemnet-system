"use client";

import React from "react";
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
import { useLoginEmployeeMutation } from "@/store/features/employeeSlice";
import { toast } from "react-toastify";

function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [login] = useLoginEmployeeMutation();

  const onSubmit = async (data) => {
    console.log("Form Submitted:", data);

    try {
      const res = await login(data).unwrap();
      toast.success(res.message || "Logged In Successfully");
      router.replace("/dashboard");
    } catch (error) {
      toast.error(error.data.message || "Something went wrong");
    }
  };

  console.log("form values", getValues(), "from err", errors);

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
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
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
