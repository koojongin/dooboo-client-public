(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9773],{22453:function(e,t,r){Promise.resolve().then(r.bind(r,97637))},47907:function(e,t,r){"use strict";var n=r(15313);r.o(n,"usePathname")&&r.d(t,{usePathname:function(){return n.usePathname}}),r.o(n,"useRouter")&&r.d(t,{useRouter:function(){return n.useRouter}}),r.o(n,"useSearchParams")&&r.d(t,{useSearchParams:function(){return n.useSearchParams}})},41231:function(e,t,r){"use strict";let n;r.d(t,{Z:function(){return i}});var u={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let o=new Uint8Array(16),a=[];for(let e=0;e<256;++e)a.push((e+256).toString(16).slice(1));var i=function(e,t,r){if(u.randomUUID&&!t&&!e)return u.randomUUID();let i=(e=e||{}).random||(e.rng||function(){if(!n&&!(n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(o)})();if(i[6]=15&i[6]|64,i[8]=63&i[8]|128,t){r=r||0;for(let e=0;e<16;++e)t[r+e]=i[e];return t}return function(e,t=0){return a[e[t+0]]+a[e[t+1]]+a[e[t+2]]+a[e[t+3]]+"-"+a[e[t+4]]+a[e[t+5]]+"-"+a[e[t+6]]+a[e[t+7]]+"-"+a[e[t+8]]+a[e[t+9]]+"-"+a[e[t+10]]+a[e[t+11]]+a[e[t+12]]+a[e[t+13]]+a[e[t+14]]+a[e[t+15]]}(i)}},97637:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return a}});var n=r(57437),u=r(47907),o=r(40874);function a(){let e=(0,u.usePathname)(),t=(0,u.useRouter)(),r=e=>{t.push(e)};return(0,n.jsx)("div",{className:"flex gap-[2px]",children:[{name:"지역",url:"/main/collection/maps",thumbnail:"/images/icon_portal.webp"},{name:"아이템",url:"/main/collection/items",thumbnail:"/images/icon_items.webp"}].map(t=>(0,n.jsxs)("div",{onClick:()=>r(t.url),className:"w-[100px] h-[100px] relative flex items-center justify-center rounded cursor-pointer border border-4 ".concat(e.indexOf(t.url)>=0?"border-blue-800":"border-transparent"),children:[(0,n.jsx)("img",{className:"",src:t.thumbnail}),(0,n.jsx)("div",{className:"absolute bg-gradient-to-b from-yellow-900 w-full text-white bottom-0 py-[3px] flex justify-center items-center",children:t.name})]},(0,o.Z)()))})}},40874:function(e,t,r){"use strict";r.d(t,{Z:function(){return u}});var n=r(41231);function u(){return(0,n.Z)()}}},function(e){e.O(0,[2971,8069,1744],function(){return e(e.s=22453)}),_N_E=e.O()}]);