(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6436],{86247:function(t,e,n){Promise.resolve().then(n.bind(n,85028))},47907:function(t,e,n){"use strict";var a=n(15313);n.o(a,"usePathname")&&n.d(e,{usePathname:function(){return a.usePathname}}),n.o(a,"useRouter")&&n.d(e,{useRouter:function(){return a.useRouter}}),n.o(a,"useSearchParams")&&n.d(e,{useSearchParams:function(){return a.useSearchParams}})},85028:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return h}});var a=n(57437),r=n(10243),c=n(2265),i=n(47907),s=n(63411),o=n.n(s),u=n(40874),l=n(605),d=n(43951),f=n(21471);let m=["-","이름","물리","냉기","화염","번개","치명타확률","치명타피해","획득골드","템렙","최대스타포스","-"];function h(){let t=(0,i.useRouter)(),e=[],[n,s]=(0,c.useState)(),[h,p]=(0,c.useState)(),b=e=>{t.push("/admindooboo/item/weapon/edit/".concat(e._id))},w=async t=>{let{isConfirmed:e}=await o().fire({title:"정말로 삭제하시겠습니까?",text:t.name||"?",icon:"question",confirmButtonText:"예",denyButtonText:"닫기",showDenyButton:!0});e&&(await (0,l.PJ)(t._id),await o().fire({title:"삭제되었습니다.",text:"-",icon:"success",confirmButtonText:"확인"}))},x=async()=>{let{page:t,total:e,totalPages:n,weapons:a}=await (0,l.Oz)();s({page:t,total:e,totalPages:n}),p(a)};return(0,c.useEffect)(()=>{x()},[]),(0,a.jsx)("div",{children:(0,a.jsxs)(r.Card,{className:"h-full w-full",children:[(0,a.jsx)(r.CardHeader,{floated:!1,shadow:!1,className:"rounded-none",children:(0,a.jsxs)("div",{className:"mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center",children:[(0,a.jsx)("div",{className:"text-2xl",children:"무기목록"}),(0,a.jsxs)("div",{className:"flex w-full shrink-0 gap-1 md:w-max",children:[(0,a.jsx)("div",{className:"w-full md:w-72",children:(0,a.jsx)(r.Input,{label:"Search"})}),(0,a.jsx)(r.Button,{className:"flex items-center gap-3",size:"sm",children:"검색준비중"})]})]})}),(0,a.jsx)(r.CardBody,{className:"overflow-scroll px-0",children:(0,a.jsxs)("table",{className:"w-full min-w-max table-auto text-left",children:[(0,a.jsx)("thead",{children:(0,a.jsx)("tr",{children:m.map(t=>(0,a.jsx)("th",{className:"border-y border-blue-gray-100 bg-blue-gray-50/50 p-1",children:(0,a.jsx)("div",{className:"p-1",children:t})},(0,u.Z)()))})}),(0,a.jsx)("tbody",{children:h&&h.map((t,n)=>{let r=n===e.length-1,c="".concat(r?"p-1":"p-1 border-b border-blue-gray-50");return(0,a.jsxs)("tr",{className:"hover:bg-gray-100 [&>*:nth-child(even)]:bg-blue-gray-50/50",children:[(0,a.jsx)("td",{className:"".concat(c," w-[50px]"),children:(0,a.jsx)("img",{src:(0,d.Z)(t.thumbnail),className:"w-[40px] h-[40px] border border-blue-gray-50 bg-blue-gray-50/50 object-contain"})}),(0,a.jsx)("td",{className:c,children:(0,a.jsx)("div",{children:t.name})}),(0,a.jsx)("td",{className:c,children:(0,a.jsx)("div",{children:(0,f.qo)(t.damageOfPhysical)})}),(0,a.jsx)("td",{className:c,children:(0,a.jsx)("div",{children:(0,f.qo)(t.damageOfCold)})}),(0,a.jsx)("td",{className:c,children:(0,a.jsx)("div",{children:(0,f.qo)(t.damageOfFire)})}),(0,a.jsx)("td",{className:c,children:(0,a.jsx)("div",{children:(0,f.qo)(t.damageOfLightning)})}),(0,a.jsx)("td",{className:c,children:(0,a.jsx)("div",{children:(0,f.qo)(t.criticalRate)})}),(0,a.jsx)("td",{className:c,children:(0,a.jsx)("div",{children:(0,f.qo)(t.criticalMultiplier)})}),(0,a.jsx)("td",{className:c,children:(0,a.jsx)("div",{children:t.gold})})," ",(0,a.jsx)("td",{className:c,children:(0,a.jsx)("div",{children:t.iLevel})}),(0,a.jsx)("td",{className:c,children:(0,a.jsx)("div",{children:t.maxStarForce})}),(0,a.jsx)("td",{className:"".concat(c),children:(0,a.jsxs)("div",{className:"flex justify-start gap-1",children:[(0,a.jsx)("div",{className:"cursor-pointer rounded bg-green-500 text-white px-2 py-0.5",onClick:()=>b(t),children:"수정"},"".concat(t._id,"-edit")),(0,a.jsx)("div",{className:"cursor-pointer rounded bg-red-700 text-white px-2 py-0.5",onClick:()=>w(t),children:"삭제"},"".concat(t._id,"-delete"))]})})]},(0,u.Z)())})})]})}),n&&(0,a.jsxs)(r.CardFooter,{className:"flex items-center justify-between border-t border-blue-gray-50 p-1",children:[(0,a.jsx)(r.Button,{variant:"outlined",size:"sm",children:"Previous"}),(0,a.jsx)("div",{className:"flex items-center gap-1",children:Array(n.totalPages).fill(1).map((t,e)=>(0,a.jsx)(r.IconButton,{variant:"outlined",size:"sm",children:e+1},(0,u.Z)()))}),(0,a.jsx)(r.Button,{variant:"outlined",size:"sm",children:"Next"})]})]})})}},38687:function(t,e,n){"use strict";n.d(e,{LJ:function(){return r},oE:function(){return a}});let a="https://dooboo.online:3001",r="/images/question_mark.webp"},605:function(t,e,n){"use strict";n.d(e,{ch:function(){return u},$b:function(){return I},PJ:function(){return _},mp:function(){return L},nw:function(){return G},in:function(){return x},AS:function(){return H},V3:function(){return M},Kd:function(){return Y},T7:function(){return D},Oz:function(){return A},wS:function(){return O},yJ:function(){return B},Gs:function(){return k},_t:function(){return N},YK:function(){return T},DJ:function(){return s},OY:function(){return p},sI:function(){return b},QN:function(){return w},ME:function(){return f},Bp:function(){return m},iX:function(){return j},VR:function(){return g},aM:function(){return o},fY:function(){return Z},Tp:function(){return E},DG:function(){return P},rJ:function(){return q},E:function(){return h},AJ:function(){return l},hv:function(){return z},je:function(){return y},O:function(){return W},RD:function(){return v},MC:function(){return d},gE:function(){return S},uw:function(){return C},ZR:function(){return R}});var a=n(7908),r=n(63411),c=n.n(r);let i=a.Z.create({baseURL:"https://dooboo.online:3001"});async function s(){let{data:t}=await i.get("/auth/jwt");return t}async function o(){let{data:t}=await i.get("/user/me");return t}async function u(t){let{data:e}=await i.get("/user/battle",{params:{name:t}});return e}async function l(t){let{data:e}=await i.post("/monster/create",t,{headers:{"Content-Type":"multipart/form-data"},transformRequest:[()=>t]});return e}async function d(t){let{data:e}=await i.put("/monster/update",t);return e}async function f(t){let{data:e}=await i.get("/monster/".concat(t));return e}async function m(){let{data:t}=await i.get("/monster/list");return t}async function h(t){let{data:e}=await i.post("/map/create",t);return e}async function p(t){let{data:e}=await i.get("/map/".concat(t));return e}async function b(){let{data:t}=await i.get("/map/list");return t}async function w(){let{data:t}=await i.get("/map/list-name");return t}async function x(t){let{data:e}=await i.delete("/map/delete",{data:{_id:t}});return e}async function A(){let{data:t}=await i.get("/item/base-weapon/list");return t}async function D(t){let{data:e}=await i.get("/item/base-weapon/".concat(t));return e}async function E(t){let{data:e}=await i.post("/item/base-weapon",t);return e}async function y(t){let{data:e}=await i.put("/item/base-weapon/".concat(t._id),t);return e}async function _(t){let{data:e}=await i.delete("/item/base-weapon/".concat(t));return e}async function g(){let{data:t}=await i.get("/character/rank");return t}async function j(){let{data:t}=await i.get("/character/inventory");return t}async function N(){let{data:t}=await i.get("/item/drop/list");return t}async function k(t){let{data:e}=await i.get("/item/drop/".concat(t));return e}async function v(t){let{data:e}=await i.put("/item/drop/".concat(t._id),t);return e}async function I(t){let{data:e}=await i.post("/item/drop",t);return e}async function G(t){let{data:e}=await i.delete("/item/drop/".concat(t));return e}async function R(t){let{data:e}=await i.post("/item/upload",{},{headers:{"Content-Type":"multipart/form-data"},transformRequest:[()=>t]});return e}async function M(t){let{data:e}=await i.post("/item/equip/".concat(t));return e}async function C(t){let{data:e}=await i.post("/item/unequip/".concat(t));return e}async function S(t){let{data:e}=await i.post("/item/sell",{itemIds:t});return e}async function T(t){let{data:e}=await i.get("/item/enhance-price/".concat(t));return e}async function H(t,e){let{data:n}=await i.post("/item/enhance/".concat(t),e);return n}async function P(t){let{data:e}=await i.post("/board/create",t);return e}async function W(t,e){let{data:n}=await i.put("/board/edit/".concat(t),e);return n}async function O(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{page:1},{data:n}=await i.post("/board/list",{condition:t,opts:e});return n}async function B(t){let{data:e}=await i.post("/board/".concat(t));return e}async function q(t,e){let{data:n}=await i.post("/board/comment/create/".concat(t),e);return n}async function L(t){let{data:e}=await i.delete("/board/delete/".concat(t));return e}async function Z(t,e){let{data:n}=await i.post("/item/auction/add/".concat(t),e);return n}async function Y(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1?arguments[1]:void 0,{data:n}=await i.post("/item/auction/list",{condition:t,opts:e});return n}async function z(t){let{data:e}=await i.post("/item/auction/purchase/".concat(t));return e}i.interceptors.request.use(t=>{let e=localStorage.getItem("token");return t.headers.Authorization=e,t},t=>Promise.reject(t)),i.interceptors.response.use(t=>t,async t=>{let{code:e,message:n,response:a}=t,{status:r,data:i}=a||{};return await c().fire({title:e,text:(null==i?void 0:i.message)||n,icon:"error",confirmButtonText:"확인"}),Promise.reject(t)})},43951:function(t,e,n){"use strict";n.d(e,{Z:function(){return r}});var a=n(38687);function r(t){return!t||t.includes(a.oE)?t:"".concat(a.oE,"/").concat(t)}},40874:function(t,e,n){"use strict";n.d(e,{Z:function(){return r}});var a=n(41231);function r(){return(0,a.Z)()}},21471:function(t,e,n){"use strict";n.d(e,{Ap:function(){return l},F6:function(){return o},Iu:function(){return f},KR:function(){return s},W:function(){return u},dW:function(){return h},oK:function(){return m},qo:function(){return i},r5:function(){return d},v9:function(){return p}});var a=n(42151),r=n.n(a);n(30971);var c=n(84555);let i=t=>{let[e,n]=t;return"".concat(e," ~ ").concat(n)},s=t=>r()(t).format("YYYY-MM-DD HH:mm:ss"),o=t=>r()(t).fromNow(),u=t=>r()(t).format("MM/DD HH:mm:ss"),l=t=>r()(t).format("HH:mm"),d=t=>{if("weapon"===t.iType)return t.weapon;throw Error("Unknown Item Type")},f=t=>{let e=t;switch(t){case"axe":e="도끼";break;case"sword":e="검";break;case"dagger":e="단검";break;case"bow":e="활";break;case"blunt":e="둔기";break;case"spear":e="창";break;case"normal":e="일반";break;case"magic":e="마법";break;case"rare":e="희귀";break;case"epic":e="서사";break;case"INCREASED_DAMAGE":e="피해 증가(%)";break;case"INCREASED_PHYSICAL_DAMAGE":e="물리 피해 증가(%)";break;case"INCREASED_COLD_DAMAGE":e="냉기 피해 증가(%)";break;case"INCREASED_FIRE_DAMAGE":e="화염 피해 증가(%)";break;case"INCREASED_LIGHTNING_DAMAGE":e="번개 피해 증가(%)";break;case"ADDED_PHYSICAL_DAMAGE":e="물리 피해 추가(+)";break;case"ADDED_COLD_DAMAGE":e="냉기 피해 추가(+)";break;case"ADDED_FIRE_DAMAGE":e="화염 피해 추가(+)";break;case"ADDED_LIGHTNING_DAMAGE":e="번개 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_AXE":e="도끼 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_SWORD":e="검 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_DAGGER":e="단검 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_BOW":e="활 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_BLUNT":e="둔기 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_SPEAR":e="창 피해 추가(+)";break;case"INCREASED_DAMAGE_WITH_AXE":e="도끼 피해 증가(%)";break;case"INCREASED_DAMAGE_WITH_SWORD":e="검 피해 증가(%)";break;case"INCREASED_DAMAGE_WITH_DAGGER":e="단검 피해 증가(%)";break;case"INCREASED_DAMAGE_WITH_BOW":e="활 피해 증가(%)";break;case"INCREASED_DAMAGE_WITH_BLUNT":e="둔기 피해 증가(%)";break;case"INCREASED_DAMAGE_WITH_SPEAR":e="창 피해 증가(%)"}return e},m=t=>{let e="#fff";switch(t){case"normal":e="#ece0e0";break;case"magic":e="#0082ff";break;case"rare":e="#fdd125";break;case"epic":e="#6000d2"}return e},h=t=>(0,c.ZP)(t);function p(t,e){let n=t.split(","),a=n[0].match(/:(.*?);/)[1],r=atob(n[1]),c=r.length,i=new Uint8Array(c);for(;c--;)i[c]=r.charCodeAt(c);return new File([i],e,{type:a})}}},function(t){t.O(0,[6384,9461,6990,8694,7908,7187,2971,8069,1744],function(){return t(t.s=86247)}),_N_E=t.O()}]);