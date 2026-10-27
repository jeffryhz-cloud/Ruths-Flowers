self.addEventListener("push",e=>{let d={};try{d=e.data.json()}catch(x){}
 e.waitUntil(self.registration.showNotification(d.titulo||"Nuevo pedido 🌸",{body:d.cuerpo||"Abre el panel para verlo.",icon:"favicon.svg",tag:"pedido",data:{url:"admin.html"}}))});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(clients.openWindow(e.notification.data.url))});
