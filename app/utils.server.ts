import { createCookie } from "@remix-run/node";

export const gradingContext = createCookie("grading-context", {
    maxAge: 60 * 60 * 24,
})