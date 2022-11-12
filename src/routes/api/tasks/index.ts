import type { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler<string[]> = async () => {
  return [
    "task1",
    "task2",
    "task3",
    "task4",
  ];
};