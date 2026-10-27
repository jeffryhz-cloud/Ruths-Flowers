const N=window.NEGOCIO,$=s=>document.querySelector(s);
if(!N.supabaseUrl){$("#login").innerHTML="<p class='err'>Falta configurar Supabase en config.js (ver README).</p>"}
else{
const sb=supabase.createClient(N.supabaseUrl,N.supabaseAnonKey);
const ESTADOS=["nuevo","pendiente","en preparación","listo","entregado","cancelado"];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
async function entrar(){const{data}=await sb.auth.getSession();const ok=!!data.session;$("#login").hidden=ok;$("#panel").hidden=!ok;if(ok){cargar();sb.channel("p").on("postgres_changes",{event:"*",schema:"public",table:"pedidos"},cargar).subscribe()}}
$("#login").onsubmit=async e=>{e.preventDefault();const f=e.target;const{error}=await sb.auth.signInWithPassword({email:f.e.value,password:f.p.value});$("#lerr").textContent=error?"Correo o contraseña incorrectos.":"";entrar()};
$("#salir").onclick=async()=>{await sb.auth.signOut();location.reload()};
$("#filtro").onchange=cargar;
async function cargar(){let q=sb.from("pedidos").select("*").order("creado",{ascending:false}).limit(100);if($("#filtro").value)q=q.eq("estado",$("#filtro").value);
 const{data,error}=await q;if(error){$("#lista").textContent="No se pudieron cargar los pedidos. Vuelve a entrar.";return}
 $("#lista").innerHTML=data.length?data.map(p=>`<article class="ped ${p.estado=="nuevo"?"nuevo":""}"><b>${esc(p.cliente)}</b> · ${new Date(p.creado).toLocaleString("es-SV")}<pre>${esc(p.detalle)}</pre><div class="fila"><select data-id="${p.id}">${ESTADOS.map(s=>`<option ${s==p.estado?"selected":""}>${s}</option>`).join("")}</select><a class="btn" target="_blank" rel="noopener" href="https://wa.me/${esc(p.telefono.replace(/\D/g,"").replace(/^(\d{8})$/,"503$1"))}">Responder</a></div></article>`).join(""):"<p class='vacio'>Aún no hay pedidos.</p>"}
$("#lista").onchange=async e=>{const id=e.target.dataset.id;if(!id)return;const{error}=await sb.from("pedidos").update({estado:e.target.value}).eq("id",id);if(error)alert("No se pudo cambiar el estado.");cargar()};
const b64=s=>Uint8Array.from(atob(s.replace(/-/g,"+").replace(/_/g,"/")),c=>c.charCodeAt(0));
$("#notif").onclick=async()=>{const m=$("#notifMsg");try{
 if(!("serviceWorker"in navigator&&"PushManager"in window))return m.textContent="Este navegador no admite notificaciones push. Prueba con Chrome (Android) o instala la página en iPhone (iOS 16.4 o superior).";
 if(!N.vapidPublicKey)return m.textContent="Falta la clave VAPID pública en config.js.";
 const reg=await navigator.serviceWorker.register("sw.js");const perm=await Notification.requestPermission();
 if(perm!=="granted")return m.textContent="El permiso fue rechazado. Actívalo en los ajustes del navegador para este sitio.";
 const sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64(N.vapidPublicKey)});
 const j=sub.toJSON();const{error}=await sb.from("push_subs").upsert({endpoint:j.endpoint,p256dh:j.keys.p256dh,auth:j.keys.auth});
 m.textContent=error?"No se pudo guardar la suscripción.":"Notificaciones activadas en este teléfono ✅"}catch(x){m.textContent="No se pudo activar: "+x.message}};
entrar()}
