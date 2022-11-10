import { scanImageData } from "@undecaf/zbar-wasm";

onmessage = async (e) => {
    if(e && e.data){
    const res = await scanImageData(e.data);
        if(res.length > 0){
            postMessage(res[0].data);
        }
    }
}
