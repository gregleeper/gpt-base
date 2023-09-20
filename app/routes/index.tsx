import { ActionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { gradingContext } from "../utils.server";
import { context as defaultContext } from "../context";
import { Button } from "../components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";

export async function loader({ request }: ActionArgs) {
  const context = await prisma.context.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!context) {
    return json({
      assistantRole: defaultContext[0].content,
      rubric: defaultContext[1].content,
      requirements: defaultContext[2].content,
    });
  }
  return json({
    assistantRole: context?.assistantRole,
    rubric: context?.rubric,
    requirements: context?.requirements,
  });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const assistantRole = formData.get("assistantRole");
  const rubric = formData.get("rubric");
  const requirements = formData.get("requirements");
  // create a session cookie to store these values for later

  if (
    typeof assistantRole === "string" &&
    typeof rubric === "string" &&
    typeof requirements === "string"
  ) {
    await prisma.context.create({
      data: {
        assistantRole: assistantRole,
        rubric: rubric,
        requirements: requirements,
      },
    });
    return redirect("/chat");
  }
    return redirect("/chat");
}
export default function Home() {
  const data = useLoaderData();
  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 form-container space-y-2">
        <h1 className="text-3xl font-bold text-center">Context</h1>
        <p className="text-lg font-light text-center">Fill out these fields in order to set the context of your chat conversation for grading purposes.</p>
      <Form method="post" name="rubricForm" className="space-y-2">
        <div>
          <Label htmlFor="assistantRole">Role of the Assistant</Label>
          <Textarea
            name="assistantRole"
            className="auto-growing-input m-0 appearance-none text-black placeholder:text-black resize-none text-sm md:text-base py-3 pl-5 pr-14 border border-slate-400 outline-none rounded-4xl w-full block leading-6 bg-gray-200"
            placeholder="Assistant Role"
            readOnly
            defaultValue={data.assistantRole || data.context[0].content || ""}
            id="assistantRole"
            cols={30}
            rows={4}
          ></Textarea>
        </div>
        <div>
          <Label htmlFor="rubric">Rubric</Label>
          <Textarea
            name="rubric"
            className="auto-growing-input m-0 appearance-none text-black placeholder:text-black resize-none text-sm md:text-base py-3 pl-5 pr-14 border border-slate-400 outline-none rounded-4xl w-full block leading-6 bg-white"
            placeholder="Add a rubric"
            defaultValue={data.rubric || data.context[1].content || ""}
            id="rubric"
            cols={30}
            rows={15}
          ></Textarea>
        </div>
        <div>
          <Label htmlFor="requirements">Requirements or Prompts</Label>
          <Textarea
            name="requirements"
            id="requirements"
            cols={30}
            rows={10}
            className="auto-growing-input m-0 appearance-none text-black placeholder:text-black resize-none text-sm md:text-base py-3 pl-5 pr-14 border border-slate-400 outline-none rounded-4xl w-full block leading-6 bg-white"
            defaultValue={data.requirements || data.context[2].content || ""}
            placeholder="Add requirements"
          ></Textarea>
        </div>
        <Button variant={"default"} type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
