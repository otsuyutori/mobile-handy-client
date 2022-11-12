import { component$, useStylesScoped$, useServerMount$, useClientEffect$, useStore, useWatch$, $} from '@builder.io/qwik';
import { DocumentHead, RequestHandler, useEndpoint } from '@builder.io/qwik-city';
import styles from './instock.css?inline';
import Scanner from './scanner';

export const onGet: RequestHandler<string> = async ({ params }) => {
  return params.task_id;
};

export default component$(() => {
  const resource = useEndpoint<string>().promise;
  const store : {tasks: ITask[] | null, cameraVisible : boolean,  value : string, isNumb : boolean} = useStore({
    tasks: [],
    cameraVisible: false,
    value: '',
    isNumb: false,
  });
  const MsgPipe$ = $((value : string)=>{store.value = value});
  const TurnOff$ = $(()=>{store.cameraVisible = false});
  useServerMount$(async () => {
    store.tasks = await getTask(resource);
    store.tasks?.forEach((item) => {item.checked = 0});
    console.log(store);
  });
  useClientEffect$(async () => {
  });

  useStylesScoped$(styles);

  useWatch$(({track})=>{
    track(() => store.value);
    if(store.tasks && !store.isNumb){
      for(const task of store.tasks){
        if(task.jancode == store.value && task.qty > task.checked){
          task.checked++;
          store.isNumb = true;
          setTimeout(() => {
            store.isNumb = false;
            console.log('reset');
            console.log(store);
          }, 2000);
        }
      }
    }
    if(store.tasks){
      store.tasks = [...store.tasks];
    }
    store.value = '';
  })
  
  return (
      <>
        <div>お買い物リスト バーコードをスキャンしてください</div>
        <Tasks store={store} />
        {store.value}<br />
        {store.cameraVisible
          ?<div class={store.isNumb ? 'processing' : ''}>
            <Scanner MsgPipe$={MsgPipe$} TurnOff$={TurnOff$}/>
          </div>
          :<button onClick$={()=>{store.cameraVisible = true}}>ON</button>
        }
      </>
  );
});

export async function getTask(taskId : any, controller?: AbortController) {
  const taskIdStr : string = await taskId;
  const resp = await fetch(`http://localhost:5173/api/tasks/${taskIdStr}`, {
    signal: controller?.signal,
  });
  const json = await resp.json();
  return Array.isArray(json) ? json : null;
}

export const Tasks = component$((props: { store: any }) => {
  useServerMount$(()=>{
  });

  useClientEffect$(() => {
  });

  useStylesScoped$(styles);

  return (
      <>
        {props.store.tasks &&
         props.store.tasks.map((task : ITask) => {return (
          <div>
            {task.qty !== task.checked
              ?<div class="row">
                <div class="instock"> { task.jancode } </div>
                <div class="qty">残り {task.qty - task.checked} 個</div>
              </div>
              :<div class="row">
                <div class="finished"> { task.jancode } :完了</div>
              </div>
            }
          </div>
          )})
        }
      </>
  );
});

export interface ITask {
  jancode : string,
  qty     : number,
  checked : number,
}

export const head: DocumentHead = {
  title: 'Mobile Handy Client ver 0.0.1',
};