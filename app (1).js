(async()=>{const Z=window.NEGOCIO;
if(Z.supabaseUrl){try{const h={apikey:Z.supabaseAnonKey,Authorization:"Bearer "+Z.supabaseAnonKey};
const[pr,aj]=await Promise.all([fetch(Z.supabaseUrl+"/rest/v1/productos?select=*&order=orden",{headers:h}).then(r=>r.json()),fetch(Z.supabaseUrl+"/rest/v1/ajustes?select=*",{headers:h}).then(r=>r.json())]);
if(Array.isArray(pr)&&pr.length)window.PRODUCTOS=pr.map(p=>({id:p.id,nombre:p.nombre,precio:Number(p.precio),desc:p.descripcion||"",img:p.img||"",disponible:p.disponible}));
if(Array.isArray(aj))aj.forEach(x=>{if(x.valor)Z[x.clave]=x.valor})}catch(e){console.warn("Usando datos de config.js",e)}}
const N=window.NEGOCIO,P=window.PRODUCTOS,$=s=>document.querySelector(s);
let carrito={};try{carrito=JSON.parse(localStorage.getItem("carrito")||"{}")}catch(e){}
const usd=n=>"$"+n.toFixed(2);
const wa=(t)=>`https://wa.me/${N.whatsapp}`+(t?`?text=${encodeURIComponent(t)}`:"");
$("#wa").href=wa("Hola, quiero información sobre sus flores 🌸");$("#lnkWa").href=wa();
$("#lnkIg").href=`https://instagram.com/${N.instagram}`;$("#lnkIg").textContent="@"+N.instagram;
$("#zona").textContent="solo "+N.zonaEntrega;$("#pago").textContent=N.pago;
$("#hor").textContent=N.horarios?"Horario: "+N.horarios:"";
if(N.mapaUrl)$("#mapa").innerHTML=`<a href="${N.mapaUrl}" target="_blank" rel="noopener">Abrir en Google Maps</a>`;
$("#grid").innerHTML=P.map(p=>`<article class="card"><img loading="lazy" src="${/^http/.test(p.img)?p.img:window.RUTA_IMG+p.img}" alt="${p.nombre}"><div><h3>${p.nombre}</h3><p>${p.desc}</p><span class="precio">${usd(p.precio)}</span><button class="btn" data-id="${p.id}" ${p.disponible?"":"disabled"}>${p.disponible?"Quiero comprar":"No disponible"}</button></div></article>`).join("");
$("#grid").onclick=e=>{const id=e.target.dataset.id;if(!id)return;carrito[id]=(carrito[id]||0)+1;pintar();$("#pedido").scrollIntoView()};
$("#videos").innerHTML=window.VIDEOS.map(v=>`<img loading="lazy" src="${window.RUTA_IMG}${v}.jpg" alt="Video de flores" data-v="${v}">`).join("");
$("#videos").onclick=e=>{const v=e.target.dataset.v;if(!v)return;const el=document.createElement("video");el.src=`${window.RUTA_VIDEO}${v}.mp4`;el.controls=true;el.autoplay=true;el.playsInline=true;e.target.replaceWith(el)};
$("#abrirCarrito").onclick=()=>$("#pedido").scrollIntoView();
function pintar(){localStorage.setItem("carrito",JSON.stringify(carrito));
 const ids=Object.keys(carrito).filter(i=>carrito[i]>0&&P.find(p=>p.id==i));
 $("#contador").textContent=ids.reduce((a,i)=>a+carrito[i],0);
 $("#vacio").hidden=ids.length>0;$("#form").hidden=!ids.length;
 $("#lineas").innerHTML=ids.map(i=>{const p=P.find(x=>x.id==i);return `<li><span>${p.nombre} × ${carrito[i]}</span><span><button data-m="${i}" aria-label="Quitar uno">−</button> <button data-a="${i}" aria-label="Agregar uno">+</button> ${usd(p.precio*carrito[i])}</span></li>`}).join("");
 $("#total").textContent=usd(ids.reduce((a,i)=>a+P.find(p=>p.id==i).precio*carrito[i],0))}
$("#lineas").onclick=e=>{const m=e.target.dataset.m,a=e.target.dataset.a;if(m)carrito[m]--;if(a)carrito[a]++;pintar()};
const f=$("#form"),hoy=new Date().toISOString().slice(0,10);f.fecha.min=hoy;
f.entrega.onchange=()=>{$("#lbDir").hidden=f.entrega.value.startsWith("Recojo")};
f.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f));const err=$("#err");err.textContent="";
 if(d.nombre.trim().length<2)return err.textContent="Escribe tu nombre.";
 if(!/^[0-9+\s-]{8,15}$/.test(d.tel.trim()))return err.textContent="Escribe un teléfono válido (solo números).";
 if(!d.fecha||d.fecha<hoy)return err.textContent="Elige una fecha desde hoy.";
 const dom=!d.entrega.startsWith("Recojo");if(dom&&!d.dir.trim())return err.textContent="Escribe la dirección de entrega en San Salvador.";
 const ids=Object.keys(carrito).filter(i=>carrito[i]>0);let tot=0;
 const lin=ids.map(i=>{const p=P.find(x=>x.id==i);tot+=p.precio*carrito[i];return `• ${carrito[i]} × ${p.nombre} (${usd(p.precio)} c/u)`});
 const texto=`Hola Ruth 🌸 Quiero hacer este pedido:\n\n${lin.join("\n")}\n\nTotal aproximado: ${usd(tot)} (pago en efectivo)\nNombre: ${d.nombre}\nTeléfono: ${d.tel}\nFecha deseada: ${d.fecha}\nEntrega: ${d.entrega}${dom?"\nDirección: "+d.dir:""}\nPersonalización: ${d.msg||"Ninguna"}\n\n¿Me confirmas disponibilidad?`;
 if(N.supabaseUrl&&N.supabaseAnonKey){try{await fetch(N.supabaseUrl+"/rest/v1/pedidos",{method:"POST",headers:{apikey:N.supabaseAnonKey,Authorization:"Bearer "+N.supabaseAnonKey,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({cliente:d.nombre,telefono:d.tel,detalle:texto,fecha_deseada:d.fecha,estado:"nuevo"})})}catch(x){console.warn("No se pudo registrar el pedido",x)}}
 window.open(wa(texto),"_blank");$("#ok").hidden=false};
pintar();

const hv=document.querySelector(".hero video");if(hv){hv.poster=window.RUTA_IMG+"v1.jpg";hv.src=window.RUTA_VIDEO+"v1.mp4";hv.play().catch(()=>{})}

})();
