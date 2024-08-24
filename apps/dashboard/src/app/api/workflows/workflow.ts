import { Client } from "@upstash/qstash";
import { NextRequest } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3001";

interface Step<I> {
  create: <O>(action: (prevResult: Awaited<I>) => O) => Step<O>;
  finally: (action: (prevResult: Awaited<I>) => any) => any;
}

export class Workflow {
  client = new Client({
    token: process.env.QSTASH_TOKEN!,
  });

  steps: Function[] = [];

  createWorkflow = (setupStep: (step: Step<any>) => void) => {
    const step: Step<any> = {
      create: <O>(action: <I>(prevResult: I) => O) => {
        this.steps.push(action);

        return step as Step<O>;
      },
      finally: (action: <I>(prevResult: I) => any) => {
        this.steps.push(action);
      },
    };

    setupStep(step);

    const POST = async (req: NextRequest) => {
      const { pathname } = new URL(req.url);

      const { searchParams } = new URL(req.url);
      const step = searchParams.get("step");

      const contentType = req.headers.get("content-type");

      if (contentType !== "application/json") {
        return new Response("Missing JSON request body.", { status: 405 });
      }

      let body: any;

      try {
        body = await req.json();
      } catch (err) {
        body = {};
      }

      if (Number(step) > this.steps.length - 1) {
        return new Response("All tasks completed successfully");
      }

      if (step === null) {
        if (process.env.NODE_ENV === "development") {
          fetch(`${baseUrl}${pathname}?step=0`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(body),
          });

          return new Response("OK");
        } else {
          try {
            await this.client.publish({
              url: `${baseUrl}${pathname}?step=0`,
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(body),
            });

            return new Response("OK");
          } catch (err) {
            console.error(err);
          }
        }
      } else {
        if (process.env.NODE_ENV === "development") {
          const action = this.steps[Number(step)];
          const res = await action(body);

          if (Number(step) < this.steps.length - 1) {
            fetch(`${baseUrl}${pathname}?step=${Number(step) + 1}`, {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(res),
            });
          }

          return new Response("OK");
        } else {
          try {
            const action = this.steps[Number(step)];
            const res = await action(body);

            // call next step with function output
            if (Number(step) < this.steps.length - 1) {
              await this.client.publish({
                url: `${baseUrl}${pathname}?step=${Number(step) + 1}`,
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify(res),
              });
            }

            return new Response("OK");
          } catch (err) {
            console.error(err);

            return new Response("Workflow error", { status: 500 });
          }
        }
      }
    };

    return { POST };
  };
}
