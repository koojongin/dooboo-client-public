(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[905],{22614:function(t,e,n){Promise.resolve().then(n.bind(n,20769))},41231:function(t,e,n){"use strict";let a;n.d(e,{Z:function(){return s}});var r={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let i=new Uint8Array(16),c=[];for(let t=0;t<256;++t)c.push((t+256).toString(16).slice(1));var s=function(t,e,n){if(r.randomUUID&&!e&&!t)return r.randomUUID();let s=(t=t||{}).random||(t.rng||function(){if(!a&&!(a="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return a(i)})();if(s[6]=15&s[6]|64,s[8]=63&s[8]|128,e){n=n||0;for(let t=0;t<16;++t)e[n+t]=s[t];return e}return function(t,e=0){return c[t[e+0]]+c[t[e+1]]+c[t[e+2]]+c[t[e+3]]+"-"+c[t[e+4]]+c[t[e+5]]+"-"+c[t[e+6]]+c[t[e+7]]+"-"+c[t[e+8]]+c[t[e+9]]+"-"+c[t[e+10]]+c[t[e+11]]+c[t[e+12]]+c[t[e+13]]+c[t[e+14]]+c[t[e+15]]}(s)}},20769:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return l}});var a=n(57437),r=n(2265),i=n(10243),c=n(19524),s=n.n(c),o=n(605),u=n(43951),d=n(40874);function l(){let[t,e]=(0,r.useState)([]),[n,c]=(0,r.useState)(),l=async()=>{e((await (0,o.QN)()).maps)},p=async(n,a)=>{e(t.map((t,e)=>{let n={...t};return n.isSelected=e===a,n}));let{map:r,monsters:i}=await (0,o.OY)(n._id);c({...r,monsters:s().sortBy(i,"weight").reverse(),totalWeight:i.reduce((t,e)=>t+e.weight,0)})};return(0,r.useEffect)(()=>{l()},[]),(0,a.jsx)("div",{className:" w-full",children:(0,a.jsxs)(i.Card,{className:"rounded p-[10px]",children:[(0,a.jsx)("div",{className:"text-[16px] text-red-300",children:"* 아래에 지역 중 하나를 선택시 해당 지역의 드랍 테이블을 조회합니다."}),(0,a.jsx)("div",{className:"flex flex-wrap gap-[4px]",children:t.map((t,e)=>(0,a.jsx)("div",{className:"flex flex-row border rounded px-[4px] py-[2px] cursor-pointer ".concat((null==t?void 0:t.isSelected)?"bg-green-300 text-white":"bg-gray-200 text-dark-blue"),onClick:()=>p(t,e),children:(0,a.jsx)("div",{className:"flex",children:t.name})},t._id))}),n&&(0,a.jsxs)("div",{className:"flex flex-col gap-[1px] mt-[10px]",children:[(0,a.jsxs)("div",{className:"flex bg-indigo-400 text-white py-[8px]",children:[(0,a.jsxs)("div",{className:"min-w-[200px] pl-[5px]",children:[(0,a.jsx)("div",{children:"등장 몬스터"}),(0,a.jsx)("div",{className:"text-[14px]",children:"- 등장 확률"}),(0,a.jsx)("div",{className:"text-[14px]",children:"- 획득 보상"})]}),(0,a.jsx)("div",{children:"드랍 일람"})]}),n.monsters.map(t=>{var e;return(0,a.jsxs)("div",{className:"flex border-b border-blue-gray-50 py-[6px]",children:[(0,a.jsx)("div",{className:"flex gap-[1px] flex-col justify-center items-start w-[200px]",children:(0,a.jsxs)("div",{className:"flex gap-[10px] justify-center items-center",children:[(0,a.jsx)("img",{src:(0,u.Z)(t.thumbnail),className:"w-[80px] h-[80px]"}),(0,a.jsxs)("div",{className:"min-w-[100px]",children:[(0,a.jsx)("div",{children:t.name}),(0,a.jsxs)("div",{className:"text-[10px]",children:[(t.weight/n.totalWeight*100).toFixed(2),"%(",t.weight,")"]}),(0,a.jsxs)("div",{className:"text-[10px] text-green-400",children:["+",t.experience.toLocaleString(),"exp, +",t.gold.toLocaleString(),"g"]}),(0,a.jsxs)("div",{className:"text-[10px] text-red-300",children:[t.hp.toLocaleString(),"hp"]})]})]})}),(0,a.jsx)("div",{className:"flex gap-[1px] items-center",children:null===(e=t.drop)||void 0===e?void 0:e.items.map(t=>{let{item:e}=t;return(0,a.jsx)("div",{children:(0,a.jsx)(i.Tooltip,{className:"rounded-none bg-transparent",interactive:!0,content:(0,a.jsx)(f,{item:t}),children:(0,a.jsxs)("div",{className:"flex flex-col",children:[(0,a.jsx)("img",{className:"border p-[1px] w-[40px] h-[40px]",src:(0,u.Z)(e.thumbnail)}),(0,a.jsxs)("div",{className:"text-center text-[10px]",children:[(1/(t.roll||0)*100).toFixed(2),"%"]})]})})},(0,d.Z)())})})]},"".concat(n._id,"_").concat(t._id))})]})]})})}function f(t){let{item:e}=t,n=e.item;return(0,a.jsxs)("div",{className:"bg-white rounded p-[12px] border border-gray-300 text-[#34343a] min-w-[300px] shadow-md drop-shadow-lg",children:[(0,a.jsx)("div",{className:"border-b border-dashed border-dark-blue mb-[2px] text-[20px]",children:null==n?void 0:n.name}),(0,a.jsxs)("div",{className:"flex flex-col gap-[1px]",children:[(0,a.jsxs)("div",{className:"flex justify-between",children:[(0,a.jsx)("div",{children:"물리 피해"}),(0,a.jsxs)("div",{children:[n.damageOfPhysical[0]," ~"," ",n.damageOfPhysical[1]]})]}),(0,a.jsxs)("div",{className:"flex justify-between",children:[(0,a.jsx)("div",{children:"냉기 피해"}),(0,a.jsxs)("div",{children:[n.damageOfCold[0]," ~ ",n.damageOfCold[1]]})]}),(0,a.jsxs)("div",{className:"flex justify-between",children:[(0,a.jsx)("div",{children:"번개 피해"}),(0,a.jsxs)("div",{children:[n.damageOfLightning[0]," ~"," ",n.damageOfLightning[1]]})]}),(0,a.jsxs)("div",{className:"flex justify-between",children:[(0,a.jsx)("div",{children:"화염 피해"}),(0,a.jsxs)("div",{children:[n.damageOfFire[0]," ~ ",n.damageOfFire[1]]})]}),(0,a.jsxs)("div",{className:"flex justify-between",children:[(0,a.jsx)("div",{children:"치명타 확률"}),(0,a.jsxs)("div",{children:[n.criticalRate[0]," ~ ",n.criticalRate[1]]})]}),(0,a.jsxs)("div",{className:"flex justify-between",children:[(0,a.jsx)("div",{children:"치명타 배율"}),(0,a.jsxs)("div",{children:[n.criticalMultiplier[0]," ~"," ",n.criticalMultiplier[1]]})]}),(0,a.jsxs)("div",{className:"flex justify-between",children:[(0,a.jsx)("div",{children:"판매 금액"}),(0,a.jsx)("div",{children:n.gold.toLocaleString()})]})]})]})}},38687:function(t,e,n){"use strict";n.d(e,{LJ:function(){return r},oE:function(){return a}});let a="https://dooboo.online:3001",r="/images/question_mark.webp"},605:function(t,e,n){"use strict";n.d(e,{ch:function(){return u},$b:function(){return R},PJ:function(){return N},mp:function(){return A},nw:function(){return k},in:function(){return g},AS:function(){return q},V3:function(){return Z},Kd:function(){return Y},T7:function(){return v},Oz:function(){return y},wS:function(){return T},yJ:function(){return M},Gs:function(){return U},_t:function(){return S},YK:function(){return I},DJ:function(){return s},OY:function(){return m},sI:function(){return h},QN:function(){return w},ME:function(){return f},Bp:function(){return p},iX:function(){return O},VR:function(){return _},aM:function(){return o},fY:function(){return F},Tp:function(){return j},DG:function(){return J},rJ:function(){return V},E:function(){return x},AJ:function(){return d},hv:function(){return B},je:function(){return b},O:function(){return P},RD:function(){return E},MC:function(){return l},gE:function(){return L},uw:function(){return D},ZR:function(){return C}});var a=n(7908),r=n(63411),i=n.n(r);let c=a.Z.create({baseURL:"https://dooboo.online:3001"});async function s(){let{data:t}=await c.get("/auth/jwt");return t}async function o(){let{data:t}=await c.get("/user/me");return t}async function u(t){let{data:e}=await c.get("/user/battle",{params:{name:t}});return e}async function d(t){let{data:e}=await c.post("/monster/create",t,{headers:{"Content-Type":"multipart/form-data"},transformRequest:[()=>t]});return e}async function l(t){let{data:e}=await c.put("/monster/update",t);return e}async function f(t){let{data:e}=await c.get("/monster/".concat(t));return e}async function p(){let{data:t}=await c.get("/monster/list");return t}async function x(t){let{data:e}=await c.post("/map/create",t);return e}async function m(t){let{data:e}=await c.get("/map/".concat(t));return e}async function h(){let{data:t}=await c.get("/map/list");return t}async function w(){let{data:t}=await c.get("/map/list-name");return t}async function g(t){let{data:e}=await c.delete("/map/delete",{data:{_id:t}});return e}async function y(){let{data:t}=await c.get("/item/base-weapon/list");return t}async function v(t){let{data:e}=await c.get("/item/base-weapon/".concat(t));return e}async function j(t){let{data:e}=await c.post("/item/base-weapon",t);return e}async function b(t){let{data:e}=await c.put("/item/base-weapon/".concat(t._id),t);return e}async function N(t){let{data:e}=await c.delete("/item/base-weapon/".concat(t));return e}async function _(){let{data:t}=await c.get("/character/rank");return t}async function O(){let{data:t}=await c.get("/character/inventory");return t}async function S(){let{data:t}=await c.get("/item/drop/list");return t}async function U(t){let{data:e}=await c.get("/item/drop/".concat(t));return e}async function E(t){let{data:e}=await c.put("/item/drop/".concat(t._id),t);return e}async function R(t){let{data:e}=await c.post("/item/drop",t);return e}async function k(t){let{data:e}=await c.delete("/item/drop/".concat(t));return e}async function C(t){let{data:e}=await c.post("/item/upload",{},{headers:{"Content-Type":"multipart/form-data"},transformRequest:[()=>t]});return e}async function Z(t){let{data:e}=await c.post("/item/equip/".concat(t));return e}async function D(t){let{data:e}=await c.post("/item/unequip/".concat(t));return e}async function L(t){let{data:e}=await c.post("/item/sell",{itemIds:t});return e}async function I(t){let{data:e}=await c.get("/item/enhance-price/".concat(t));return e}async function q(t,e){let{data:n}=await c.post("/item/enhance/".concat(t),e);return n}async function J(t){let{data:e}=await c.post("/board/create",t);return e}async function P(t,e){let{data:n}=await c.put("/board/edit/".concat(t),e);return n}async function T(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{page:1},{data:n}=await c.post("/board/list",{condition:t,opts:e});return n}async function M(t){let{data:e}=await c.post("/board/".concat(t));return e}async function V(t,e){let{data:n}=await c.post("/board/comment/create/".concat(t),e);return n}async function A(t){let{data:e}=await c.delete("/board/delete/".concat(t));return e}async function F(t,e){let{data:n}=await c.post("/item/auction/add/".concat(t),e);return n}async function Y(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1?arguments[1]:void 0,{data:n}=await c.post("/item/auction/list",{condition:t,opts:e});return n}async function B(t){let{data:e}=await c.post("/item/auction/purchase/".concat(t));return e}c.interceptors.request.use(t=>{let e=localStorage.getItem("token");return t.headers.Authorization=e,t},t=>Promise.reject(t)),c.interceptors.response.use(t=>t,async t=>{let{code:e,message:n,response:a}=t,{status:r,data:c}=a||{};return await i().fire({title:e,text:(null==c?void 0:c.message)||n,icon:"error",confirmButtonText:"확인"}),Promise.reject(t)})},43951:function(t,e,n){"use strict";n.d(e,{Z:function(){return r}});var a=n(38687);function r(t){return!t||t.includes(a.oE)?t:"".concat(a.oE,"/").concat(t)}},40874:function(t,e,n){"use strict";n.d(e,{Z:function(){return r}});var a=n(41231);function r(){return(0,a.Z)()}}},function(t){t.O(0,[6384,9461,1866,8694,7908,2971,8069,1744],function(){return t(t.s=22614)}),_N_E=t.O()}]);