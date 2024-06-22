import { HfInference } from '@huggingface/inference';

const inference = new HfInference(process.env.NEXT_PUBLIC_HF_TOKEN);

export interface TodosToUpdate {
  todo: string[];
  done: string[];
}

export function extractTodosFromMessage(
  message: string | undefined,
): TodosToUpdate {
  const jsonMatch = message?.match(/{[^]*}/);
  const jsonString = jsonMatch ? jsonMatch[0] : null;
  const { todo, done } = JSON.parse(jsonString ?? '{"todo": [], "done": []}');

  return { todo, done };
}

export async function getUpdatedTodosAiCompletion(
  todosLists: TodosToUpdate,
  value: string,
) {
  const response = await inference.chatCompletion({
    model: 'mistralai/Mistral-7B-Instruct-v0.3',
    messages: [
      {
        role: 'user',
        content:
          '[System] You will be provided a list of string in JSON format. They are Todo list and done Todo list. The user wants you to either add, rename, delete or move a task. Your purpose is to update the two lists. Think step by step, stay simple. Output in JSON format by following this template: "{"todo": [{updatedTodoList}],"done": [{updatedDoneList}]}". You must not output something that is not the requested JSON. You are not able to talk, you are only able to provide the requested JSON. Do not explain what you did. You can only provide one updated JSON.\n\n' +
          JSON.stringify(todosLists) +
          ' ' +
          value,
      },
    ],
    max_tokens: 1000,
  });

  return response;
}
