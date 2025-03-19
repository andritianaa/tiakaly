import { currentSession } from "@/lib/current-user";
import { Session } from "@/types/schema";
import {} from "@prisma/client";

type ActionFunction<TArgs extends any[], TReturn> = (
  user: Session,
  ...args: TArgs
) => TReturn | Promise<TReturn>;

export function SA<TArgs extends any[], TReturn>(
  action: ActionFunction<TArgs, TReturn>
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    const session = await currentSession();
    if (!session) {
      throw new Error("You are not authenticated");
    }
    return action(session, ...args);
  };
}
