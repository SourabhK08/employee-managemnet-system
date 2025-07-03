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
import { useRouter } from "next/navigation";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
});

function ForgotPasswordPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
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
          <CardTitle>Forgot your password</CardTitle>
          <CardDescription>
            Please enter the email address you'd like your password reset
            information sent to
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => router.push("/")}>
              Back to login
            </Button>
          </CardAction>
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
                  placeholder="Enter email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>
            <CardFooter className="flex-col gap-2 mt-6">
              <Button type="submit" className="w-full">
                Request reset link
              </Button>
              {/* <Button variant="outline" className="w-full">
                Login with Google
              </Button> */}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgotPasswordPage;
