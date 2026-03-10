"use server";

// Example server action — copy this pattern for new actions.
//
// Checklist:
// 1. "use server" at top
// 2. getSession() for auth check
// 3. Zod .parse(input) for validation
// 4. Return { success: true } or { error: "..." }
// 5. revalidatePath() after mutations

// import { revalidatePath } from "next/cache";
// import { getSession } from "@/lib/auth";
// import { db } from "@/lib/db/db";
// import { mySchema, type MyInput } from "@/lib/validations/my-schema";

// export async function myAction(input: MyInput) {
//   const session = await getSession();
//   if (!session) throw new Error("Not authenticated");
//
//   const parsed = mySchema.parse(input);
//
//   // ... business logic, DB queries ...
//
//   revalidatePath("/my-page");
//   return { success: true };
// }
