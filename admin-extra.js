(()=>{const N=window.NEGOCIO,$=s=>document.querySelector(s);if(!N.supabaseUrl)return;const sb=window.sbAdmin;
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const src=p=>!p.img?"":/^http/.test(p.img)?p.img:window.RUTA_IMG+p.img;
const CAMPOS=[["whatsapp","WhatsApp (con 503, solo números)"],["instagram","Instagram (sin @)"],["horarios","Horarios de atención"],["correo","Correo (opcional)"],["mapaUrl","Enlace de Google Maps (opcional)"],["zonaEntrega","Zona de entrega"],["pago","Métodos de pago"]];
async function init(){const{data}=await sb.auth.getSession();$("#extra").hidden=!data.session;if(data.session){prod();ajustes()}}
sb.auth.onAuthStateChange(()=>init());init();
async function prod(){const{data,error}=await sb.from("productos").select("*").order("orden");if(error){$("#prods").textContent="No se pudieron cargar los productos. ¿Ya ejecutaste supabase.sql?";return}
 $("#prods").innerHTML=data.map(p=>`<div class="ped" data-id="${esc(p.id)}">${p.img?`<img src="${esc(src(p))}" alt="" width="90" style="border-radius:12px">`:""}
 <label>Nombre<input data-f="nombre" value="${esc(p.nombre)}"></label><label>Precio (US$)<input data-f="precio" type="number" step="0.01" min="0" value="${p.precio}"></label>
 <label>Descripción<textarea data-f="descripcion" rows="2">${esc(p.descripcion)}</textarea></label>
 <label><span><input type="checkbox" data-f="disponible" ${p.disponible?"checked":""}> Disponible</span></label>
 <label>Cambiar foto<input type="file" accept="image/*" data-f="foto"></label>
 <div class="fila"><button class="btn" data-g>Guardar</button><button class="btn ghost" data-b style="color:#a3122a;border-color:#a3122a">Borrar</button></div><p class="nota" data-m role="status"></p></div>`).join("")||"<p class='vacio'>Aún no hay productos.</p>"}
function reducir(file){return new Promise((ok,no)=>{const i=new Image();i.onload=()=>{const k=Math.min(1,1000/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=i.width*k;c.height=i.height*k;c.getContext("2d").drawImage(i,0,0,c.width,c.height);c.toBlob(b=>b?ok(b):no(new Error("imagen")),"image/jpeg",.85)};i.onerror=()=>no(new Error("No se pudo leer la imagen"));i.src=URL.createObjectURL(file)})}
$("#prods").onclick=async e=>{const card=e.target.closest(".ped"),id=card?.dataset.id;if(!id)return;const m=card.querySelector("[data-m]");
 if(e.target.dataset.b!==undefined){if(!confirm("¿Borrar este producto?"))return;const{error}=await sb.from("productos").delete().eq("id",id);return error?m.textContent="No se pudo borrar.":prod()}
 if(e.target.dataset.g===undefined)return;const v=f=>card.querySelector(`[data-f=${f}]`);const precio=parseFloat(v("precio").value);
 if(!v("nombre").value.trim()||!(precio>=0))return m.textContent="Escribe un nombre y un precio válido.";
 const cambios={nombre:v("nombre").value.trim(),precio,descripcion:v("descripcion").value,disponible:v("disponible").checked};
 try{const f=v("foto").files[0];if(f){m.textContent="Subiendo foto…";const b=await reducir(f);const ruta=`${id}-${Date.now()}.jpg`;const up=await sb.storage.from("fotos").upload(ruta,b,{contentType:"image/jpeg"});if(up.error)throw up.error;cambios.img=sb.storage.from("fotos").getPublicUrl(ruta).data.publicUrl}
 const{error}=await sb.from("productos").update(cambios).eq("id",id);if(error)throw error;m.textContent="Guardado ✅"}catch(x){m.textContent="No se pudo guardar: "+x.message}};
$("#nuevoProd").onclick=async()=>{const{data}=await sb.from("productos").select("orden").order("orden",{ascending:false}).limit(1);
 const{error}=await sb.from("productos").insert({id:Math.random().toString(36).slice(2,8),nombre:"Nuevo producto",precio:0,descripcion:"",disponible:false,orden:(data?.[0]?.orden??0)+1});if(!error)prod()};
async function ajustes(){const{data}=await sb.from("ajustes").select("*");const d=Object.fromEntries((data||[]).map(x=>[x.clave,x.valor]));
 const val=k=>d[k]||(["whatsapp","instagram","zonaEntrega","pago"].includes(k)?N[k]:"")||"";
 $("#ajustes").innerHTML=CAMPOS.map(([k,t])=>`<label>${t}<input name="${k}" value="${esc(val(k))}"></label>`).join("")+'<button class="btn">Guardar datos</button>'}
$("#ajustes").onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));f.whatsapp=f.whatsapp.replace(/\D/g,"");
 if(f.whatsapp.length<8){$("#amsg").textContent="El WhatsApp debe tener solo números, con código de país.";return}
 if(f.mapaUrl&&!/^https:\/\//.test(f.mapaUrl)){$("#amsg").textContent="El enlace del mapa debe empezar con https://";return}
 const{error}=await sb.from("ajustes").upsert(Object.entries(f).map(([clave,valor])=>({clave,valor})));$("#amsg").textContent=error?"No se pudieron guardar los datos.":"Datos guardados ✅"}})();
