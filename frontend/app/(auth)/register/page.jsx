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
import registerSchema from "@/schema/registerSchema";

function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      fullname: "",
      phone_number: null,
    },
  });

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    router.replace("/dashboard");
  };

  console.log("form values", getValues(), "from err", errors);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-blue-500 via-purple-500 to-pink-500  p-4">
      <Card className="w-full max-w-sm bg-slate-100 opacity-98 shadow-lg">
        <CardHeader>
          <CardTitle>Register your account</CardTitle>
          <CardDescription>
            Enter your details below to register your account
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => router.push("/")}>
              Log In
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="fullname" required={true}>
                  Full Name
                </Label>
                <Input
                  id="fullname"
                  type="string"
                  placeholder="Enter your fullname"
                  {...register("fullname")}
                />
                {errors.fullname && (
                  <p className="text-red-500 text-sm">
                    {errors.fullname.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone_number" required={true}>
                  Phone Number
                </Label>
                <Input
                  id="phone_number"
                  type="number"
                  placeholder="Enter your phone_number"
                  {...register("phone_number")}
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm">
                    {errors.phone_number.message}
                  </p>
                )}
              </div>
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
                    href="#"
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
                Register
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterPage;
