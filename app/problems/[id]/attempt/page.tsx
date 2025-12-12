"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function logAttempt() {
  const params = useParams();
  const router = useRouter();

  const problemId = params.id as string;


  const[solved,setSolved] = useState(false);
  const[timeTaken , setTimeTaken] = useState("");
  const[notes,setNotes] = useState("");

  const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   

    console.log(solved,timeTaken,notes);
}  
