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
          '[System] You will be provided a list of string in JSON format. They are Todo list and done Todo list. Your only task is move ONE AND ONLY ONE item of a list to the other list according to the user input. YOU CAN MOVE ONE AND ONLY ONE thing from a list to another. DO NOT FORGET SOMETHING FROM A LIST IF YOU DON\'T NEED TO UPDATE IT. Output it in JSON format by following this template: "{"todo": [{updatedTodoList}],"done": [{updatedDoneList}]}". You can not generate text that isn\'t asked for. DO NOT FORGET ANYTHING IN THE TEMPLATE. REMEMBER THAT YOU CAN ONLY MOVE ONE AND ONLY ONE ITEM AT THE TIME FOR A JSON OUTPUT. Let\'s try it to see if you understood.\n\n{"todo": ["AI Fish or Phish","Compile Coral DB","AI Sub Navigation","Server Water Cooling","Whale Song AI","Marine Chatbot"],"done": ["Dolphin Comm Sim"]}\n "i just finished ai fish"',
      },
      {
        role: 'assistant',
        content:
          '{"todo": ["Compile Coral DB","AI Sub Navigation","Server Water Cooling","Whale Song AI","Marine Chatbot"],"done": ["Dolphin Comm Sim","AI Fish or Phish"]}',
      },
      {
        role: 'user',
        content: JSON.stringify(todosLists) + ' ' + value,
      },
    ],
    max_tokens: 100,
  });

  return response;
}
