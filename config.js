// ===== CONFIGURACIÓN DEL NEGOCIO (editable) =====
window.NEGOCIO = {
  nombre: "Ruth's Flowers",
  lema: "Pequeños detalles, grandes emociones",
  whatsapp: "50376612837",            // formato internacional, sin + ni espacios
  instagram: "ruth_sflowers",
  zonaEntrega: "San Salvador",         // no se publica dirección particular
  pago: "Solo efectivo",
  horarios: "",                        // PENDIENTE: completar (ej. "Lunes a sábado, 9:00 a 18:00")
  correo: "",                          // PENDIENTE (opcional)
  mapaUrl: "",                         // PENDIENTE (opcional): enlace de Google Maps
  // Supabase (opcional). La clave "anon" es pública por diseño; la protege RLS (ver supabase.sql).
  supabaseUrl: "",
  supabaseAnonKey: "",
  vapidPublicKey: ""                   // clave VAPID PÚBLICA (ver README)
};
// Fotos de producto: referenciales, tomadas del catálogo. Reemplázalas en assets/img/.
window.PRODUCTOS = [
  {id:"rosa-1",  nombre:"1 Rosa",     precio:2,  img:"assets/img/rosa-1.jpg",        desc:"Una rosa de listón hecha a mano, ideal para un detalle sencillo.", disponible:true},
  {id:"girasol", nombre:"1 Girasol",  precio:3,  img:"assets/img/girasol.jpg",       desc:"Un girasol artesanal que no se marchita.", disponible:true},
  {id:"rosas-3", nombre:"3 Rosas",    precio:6,  img:"assets/img/rosas-rosa.jpg",    desc:"Mini ramo de 3 rosas, con mariposa decorativa.", disponible:true},
  {id:"rosas-6", nombre:"6 Rosas",    precio:10, img:"assets/img/rosas-amarillo.jpg",desc:"Ramo de 6 rosas con envoltura de papel.", disponible:true},
  {id:"rosas-10",nombre:"10 Rosas",   precio:17, img:"assets/img/rosas-amarillo.jpg",desc:"Ramo de 10 rosas hechas a mano.", disponible:true},
  {id:"rosas-15",nombre:"15 Rosas",   precio:25, img:"assets/img/rosas-rosa.jpg",    desc:"Ramo de 15 rosas, un regalo que se nota.", disponible:true},
  {id:"rosas-20",nombre:"20 Rosas",   precio:33, img:"assets/img/ramo-dinero.jpg",   desc:"Ramo grande de 20 rosas.", disponible:true}
];
window.VIDEOS = ["v2","v3","v4","v5","v6","v7","v8","v9"];
