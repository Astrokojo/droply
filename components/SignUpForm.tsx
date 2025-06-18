"use client"

import { useForm } from "react-hook-form"
import { useSignUp } from "@clerk/nextjs"
import { z } from "zod"

// zod custom schema
import { signUpSchema } from "@/schemas/signUpSchema"
import {useState} from "react"
   
export default function SignUpForm() {
    const [verifying, setVerifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isauthError, setAuthError] = useState<string | null>(null);
    const { signUp, isLoaded, setActive } = useSignUp();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
        },
    });
    


    const onSubmit = async (data: z.infer<typeof signUpSchema>) => { 
        if (!isLoaded) return;
        setIsSubmitting(true)
        setAuthError(null)

        try {
            signUp.create({
                emailAddress: data.email,
                password: data.password,
            })
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            })
            setVerifying(true)
        } catch (error: any) {
            console.error("Signup error: ", error)
            setAuthError(
                error.errors?.[0]?.message || "An error occured during the signup, please try again"
            )

        } finally {
            setIsSubmitting(false)
        }
        
    };
    const handleVerificationSubmit = async () => { };
    
    if (verifying) {
        return <h1>This is OTP input field</h1>

    }

    return <h1>Sign Up Form witih email</h1>

}
