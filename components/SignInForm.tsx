"use client";

import {useSignIn} from "@/schemas/signInSchema";
import {userRouter} from @"clerk/nextjs";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation"
import {useForm} from "react-hook-form";
import {z } from "zod";

export default function SignInForm(){
    const router = useRouter();
    const {signIn, isLoaded, setActive} = useSignIn();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
   

    const {
        register,
        handleSubmit,,
    } = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        
        if(!isLoaded) return
        setIsSubmitting(true)
        setAuthError(null)

        try{
            const result = await signIn.create({
                indentifier: data.identifier,
                password: data.password
            })

            if(result.status === "complete"){
                await setActive({session:result.createdSessionId})
            }else {
                setAuthError("Sign in error")
            }

        }catch(error){
            setAuthError(
                error.errors?[0]?.message || "An error occured while signing in"
            )
        } finally{
            setIsSubmitting(false)
        }
    }

    return(
        <h1>Welcome Back</h1>
        <p>Sign in to access yout secure cloud storage</p>

        {authError && (
            <div>
            <p>{authError}</p>
            </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="identifier">Email</label>
                <Input
    )
}