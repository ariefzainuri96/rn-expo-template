---
name: form-validation
description: React Hook Form + Zod pattern for all forms. Schemas live in validation/ and are shared between the form and the service layer via inferred TypeScript types. Every input uses a Controller wrapper.
---

# Form Validation Pattern

## When to Use
- Add any form (login, register, search, settings)
- Add or modify validation rules
- Connect a form to a React Query mutation

## Architecture

    validation/<feature>.ts   Zod schema + inferred type
           |
    useForm<FormInput>({ resolver: zodResolver(schema) })
           |
    <Controller> wrapping each RN TextInput
           |
    handleSubmit(onSubmit)  calls mutation/service

## Core Files

- validation/login.ts
- validation/news.ts
- app/(auth)/login.tsx

## Pattern: Zod Schema

    // validation/login.ts
    import { z } from "zod";
    export const loginSchema = z.object({
        email: z.email("Enter a valid email address."),
        password: z.string().min(8, "Password must be at least 8 characters."),
    });
    export type LoginInput = z.infer<typeof loginSchema>;

## Pattern: Form Setup

    import { Controller, SubmitHandler, useForm } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";
    import { LoginInput, loginSchema } from "@/validation/login";

    const { control, handleSubmit, formState: { errors } } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

## Pattern: Controller + TextInput

    <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
            <TextInput value={value} onChangeText={onChange} onBlur={onBlur} />
        )}
    />
    {errors.email && <Text>{errors.email.message}</Text>}

## Pattern: Submit with Mutation

    const mutation = useLogin();
    const onSubmit: SubmitHandler<LoginInput> = useCallback(async (data) => {
        mutation.mutate(data, {
            onSuccess: (res) => { signIn(res.token); router.replace("/(tabs)"); },
            onError: (err) => { showToast({ title: err.message }); },
        });
    }, [mutation, signIn]);

## Gotchas

- Always define defaultValues — RN TextInput is uncontrolled by default.
- Use z.email() not z.string().email() in Zod v4+.
- Null-check error messages: {errors.field && <Text>}.
- Wrap onSubmit with useCallback to prevent needless re-creation.

## Anti-Patterns

    // Wrong: manual form state
    const [email, setEmail] = useState("");

    // Wrong: inline validation
    if (!email.includes("@")) setError("Invalid");

    // Wrong: schema inside component file
    // Define it in validation/ directory instead
    const schema = z.object({ email: z.email() });
