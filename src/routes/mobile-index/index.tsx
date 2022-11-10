import { component$, useStore, useStylesScoped$, useServerMount$, useClientEffect$ } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import styles from './index.css?inline';
import ip from 'ip';

export default component$(() => {
  const store : {taskBatch: ITaskBatch | null, cameraVisible: boolean} = useStore({
    taskBatch : null,
    cameraVisible: false,
  });
  useServerMount$(async () => {
    store.taskBatch = await getTaskBatch();
  });
  useStylesScoped$(styles);
  useClientEffect$(()=>{
    console.log(store)
  });

  return (
    <>
        <header
        class={{
          title: true,
        }}
        >
            RMT!
        </header>
        <main>
            <section>
                <span class="button-instock">Tasks</span>
                <Tsk taskBatch={store.taskBatch} />
            </section>
        </main>
        <footer>
        </footer>
    </>
  );
});

export const Tsk = component$((props: {taskBatch: ITaskBatch | null}) => {
  const store : {tasks : any[] | null} = useStore({
    tasks : [],
  });

  useServerMount$(()=>{
    console.log(props);
    if(props.taskBatch){
      store.tasks = props.taskBatch.tasks;
    }
  });

  return (
    <>
      {store.tasks &&
       store.tasks.map((task)=>{return (
        <div><a href={task.url}>{task.name}</a></div>
        )})
      }
    </>
  );
});

export async function getTaskBatch(controller?: AbortController) {
const resp = await fetch(`http://localhost:3004/tasks`, {
  signal: controller?.signal,
});
const json = await resp.json();
let res :ITaskBatch | null = null;
if(Array.isArray(json)){
  const localIp = ip.address();
  const tasks = json.map((item)=>{return {url: `http://${localIp}:5173/` + item +'/instock', name: item}})
  res = {
    tasks: tasks
  }
}
return res;
}

export interface ITaskBatch {
  tasks: {url: string, name: string}[],
}

export const head: DocumentHead = {
  title: 'Mobile Handy Client ver 0.0.1',
};
