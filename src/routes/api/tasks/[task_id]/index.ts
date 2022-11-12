import type { RequestHandler } from '@builder.io/qwik-city';

export interface ITask {
    jancode : string,
    qty     : number,
    checked : number,
}

const tasks : Map<string, ITask[]> = new Map()
tasks.set('task1', [
    {jancode: '4582151174312', qty: 4, checked: 0},
    {jancode: '4525678095098', qty: 1, checked: 0},
    {jancode: 'bbb', qty: 1, checked: 0},
    {jancode: 'ccc', qty: 1, checked: 0},
]); 
tasks.set('task2', [
    {jancode: '1234', qty: 1, checked: 0},
    {jancode: 'aaa', qty: 1, checked: 0},
    {jancode: 'bbb', qty: 1, checked: 0},
    {jancode: 'ccc', qty: 1, checked: 0},
]); 
tasks.set('task3', [
    {jancode: '1234', qty: 1, checked: 0},
    {jancode: 'aaa', qty: 1, checked: 0},
    {jancode: 'bbb', qty: 1, checked: 0},
    {jancode: 'ccc', qty: 1, checked: 0},
]); 
tasks.set('task4', [
    {jancode: '1234', qty: 1, checked: 0},
    {jancode: 'aaa', qty: 1, checked: 0},
    {jancode: 'bbb', qty: 1, checked: 0},
    {jancode: 'ccc', qty: 1, checked: 0},
]); 

export const onGet: RequestHandler<ITask[]> = async ( {params} ) => {
    return tasks.get(params.task_id);
};