import { component$, useServerMount$, useClientEffect$, useStore} from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  const store : {value: number} = useStore(
    {value: 0}
  );
  useServerMount$(() =>{
    store.value = 1;
  });
  useClientEffect$(()=>{
  });
  return (
    <div>
      <div>parent</div>
      <Cpt store={store} />
    </div>
  );
});

export const Cpt = component$((props:{store: {value: number}}) => {
  useServerMount$(() =>{
    props.store.value = 1000;
    console.log(props);
  });
  useClientEffect$(()=>{
  });
  return (
    <div>
      Child Component {props.store.value}
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Test Component',
};
