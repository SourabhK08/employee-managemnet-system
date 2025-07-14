'use client'
import TextInput from "@/components/ui-main/TextInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

function page() {
    const router = useRouter()
    const {register,getValues,setValue,formState:{errors}} = useForm()
  return (
    <>
      <form>
        <div className="bg-gray-100 grid gap-2">
          <TextInput
          name="email"
          placeholder='Enter email'
          label={'Email'}
          classname={``}
          />
        </div>
      </form>
    </>
  );
}

export default page;
