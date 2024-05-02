(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9219],{55142:function(e,t,n){Promise.resolve().then(n.bind(n,41750))},47907:function(e,t,n){"use strict";var a=n(15313);n.o(a,"usePathname")&&n.d(t,{usePathname:function(){return a.usePathname}}),n.o(a,"useRouter")&&n.d(t,{useRouter:function(){return a.useRouter}}),n.o(a,"useSearchParams")&&n.d(t,{useSearchParams:function(){return a.useSearchParams}})},41750:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return h}});var a=n(57437),r=n(2265),i=n(10243),c=n(63411),s=n.n(c),o=n(47907),u=n(605),l=n(43951),d=n(40874),f=(0,r.forwardRef)(function(e,t){let{onSelectItem:n}=e,[c,s]=(0,r.useState)(),[o,d]=(0,r.useState)(!1),[f,m]=(0,r.useState)([]),p=async()=>{let{weapons:e}=await (0,u.Oz)();m(e)},x=async()=>{d(!o),await p()},h=e=>{d(!1),n(e,c)};return(0,r.useImperativeHandle)(t,()=>({openDialog:e=>{s(e),x()}})),(0,a.jsx)(i.Dialog,{open:o,handler:x,children:(0,a.jsxs)(i.DialogBody,{className:"h-[42rem] overflow-y-scroll",children:[(0,a.jsx)("div",{children:"아이템 목록 - 클릭시 선택됩니다."}),(0,a.jsx)("div",{className:"flex flex-wrap gap-1",children:f.map(e=>(0,a.jsx)("div",{className:"cursor-pointer",onClick:()=>h(e),children:(0,a.jsx)(i.Tooltip,{interactive:!0,content:(0,a.jsx)("div",{children:e.name}),children:(0,a.jsx)("div",{className:"max-w-[36px] w-[36px] h-[36px] p-[2px] border border-dark-blue",children:(0,a.jsx)("img",{className:"w-full h-full",src:(0,l.Z)(e.thumbnail)})})})},e._id))})]})})}),m=(0,r.forwardRef)(function(e,t){let{onSelectMonster:n}=e,[c,s]=(0,r.useState)(),[o,d]=(0,r.useState)(!1),[f,m]=(0,r.useState)([]),p=async()=>{let{monsters:e}=await (0,u.Bp)();m(e)},x=async()=>{d(!o),await p()},h=e=>{d(!1),n(e)};return(0,r.useImperativeHandle)(t,()=>({openDialog:e=>{s(e),x()}})),(0,a.jsx)(i.Dialog,{open:o,handler:x,children:(0,a.jsxs)(i.DialogBody,{className:"h-[42rem] overflow-y-scroll",children:[(0,a.jsx)("div",{children:"몬스터 목록 - 클릭시 선택됩니다."}),(0,a.jsx)("div",{className:"flex flex-wrap gap-1",children:f.map(e=>(0,a.jsx)("div",{className:"cursor-pointer",onClick:()=>h(e),children:(0,a.jsx)(i.Tooltip,{interactive:!0,content:(0,a.jsx)("div",{children:e.name}),children:(0,a.jsx)("div",{className:"max-w-[50px]",children:(0,a.jsx)("img",{src:(0,l.Z)(e.thumbnail)})})})},e._id))})]})})}),p=n(21471);function x(e){var t;let{dropTable:n,setDropTable:c}=e,s=(0,r.useRef)(null),o=(0,r.useRef)(null),u=e=>{var t;null==s||null===(t=s.current)||void 0===t||t.openDialog(e)},x=()=>{var e;null==o||null===(e=o.current)||void 0===e||e.openDialog()},h=e=>{let t={...n};t.items=t.items.splice(0,e),c({...t})},w=()=>{let e={...n};e.items.push({iType:"BaseWeapon",roll:0}),c({...e})},b=(e,t)=>{let a={...n};a.items[e].roll=parseFloat(t),c({...a})};return(0,a.jsxs)("div",{children:[(0,a.jsx)(f,{ref:s,onSelectItem:(e,t)=>{let a={...n};a.items[t].itemId=e._id,a.items[t].item={...a.items[t].item,...e},c({...a})}}),(0,a.jsx)(m,{ref:o,onSelectMonster:e=>{let t={...n};t.monster=e,t.monsterId=e._id,c({...t})}}),(0,a.jsxs)("div",{className:"[&>div]:border-b-gray-300 [&>div]:border-b [&>div]:mb-1 [&>div]:py-1",children:[(0,a.jsxs)("div",{className:"flex gap-1",children:[(0,a.jsx)("div",{className:"min-w-[200px]",children:"수정일시"}),(0,a.jsx)("div",{className:"flex flex-row items-center gap-1",children:(0,p.KR)(n.updatedAt)})]}),(0,a.jsxs)("div",{className:"flex gap-1",children:[(0,a.jsx)("div",{className:"min-w-[200px]",children:"선택된 몬스터"}),(0,a.jsxs)("div",{className:"flex flex-row items-center gap-1",children:[n.monster&&(0,a.jsxs)("div",{className:"flex flex-col gap-1",children:[(0,a.jsxs)("div",{className:"flex items-center gap-1",children:[(0,a.jsx)("div",{className:"w-[80px] h-[80px] max-w-[80px] border-dark-blue border",children:(0,a.jsx)("img",{src:"".concat((0,l.Z)(null===(t=n.monster)||void 0===t?void 0:t.thumbnail))})}),(0,a.jsx)("div",{children:n.monster.name})]}),(0,a.jsx)("div",{className:"cursor-pointer rounded bg-green-500 text-white flex items-center justify-center py-0.5",onClick:()=>x(),children:"변경"})]}),!n.monster&&(0,a.jsx)("div",{children:(0,a.jsx)("div",{className:"px-[8px] cursor-pointer rounded bg-green-500 text-white flex items-center justify-center py-0.5",onClick:()=>x(),children:"몬스터 등록"})})]})]}),(0,a.jsxs)("div",{className:"flex gap-1",children:[(0,a.jsx)("div",{className:"min-w-[200px]",children:"드랍 아이템 목록"}),(0,a.jsxs)("div",{className:"w-full",children:[(0,a.jsxs)("div",{className:"flex items-center gap-1 bg-dark-blue text-white w-full mb-1",children:[(0,a.jsx)("div",{className:"min-w-[50px]",children:"-"}),(0,a.jsx)("div",{className:"min-w-[150px]",children:"아이템명"}),(0,a.jsx)("div",{className:"cursor-pointer w-[150px] max-w-[150px]",children:(0,a.jsx)(i.Tooltip,{interactive:!0,content:(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{children:"설정한 값을 최대 값으로 갖는 주사위를 굴려 1을 뽑을 확률입니다."}),(0,a.jsxs)("div",{children:["----",(0,a.jsx)("br",{}),"만약 설정 값이 10이라면 주사위 굴려서 1을 뽑을 확률은 다음과 같습니다."]}),(0,a.jsx)("div",{children:"= 1/10 = 10%"})]}),children:"드랍 주사위(?)"})})]}),n.items.map((e,t)=>{let{item:n}=e;return(0,a.jsxs)("div",{className:"flex items-center mb-1 gap-1",children:[(0,a.jsx)("div",{className:"min-w-[50px]",children:(0,a.jsx)("div",{className:"cursor-pointer rounded bg-red-700 text-white flex items-center justify-center w-[20px]",onClick:()=>h(t),children:"x"})}),(0,a.jsxs)("div",{className:"min-w-[150px]",children:[(null==n?void 0:n.name)&&(0,a.jsx)("div",{children:null==n?void 0:n.name}),!(null==n?void 0:n.name)&&(0,a.jsx)("div",{className:"cursor-pointer rounded bg-green-500 text-white flex items-center justify-center py-0.5",onClick:()=>u(t),children:"드랍 아이템 선택"})]}),(0,a.jsx)("input",{type:"number",className:"w-[150px] max-w-[150px] flex border-2 rounded-md border-blue-200",onChange:e=>{b(t,e.target.value)},value:e.roll}),(0,a.jsxs)("div",{children:[(1/e.roll*100).toFixed(5),"%"]})]},(0,d.Z)())}),(0,a.jsx)("div",{className:"cursor-pointer rounded bg-green-500 text-white flex items-center justify-center py-0.5",onClick:()=>w(),children:"드랍 아이템 추가"})]})]})]}),(0,a.jsx)("div",{})]})}function h(e){let{params:t}=e,n=(0,o.useRouter)(),{dropTableId:c}=t,[l,d]=(0,r.useState)(),f=async e=>{let{dropTable:t}=await (0,u.Gs)(e);d(t)},m=async()=>{let e=!1,t="";if(l||(e=!0,t="버그"),(null==l?void 0:l.monster)&&(null==l?void 0:l.monsterId)||(e=!0,t="몬스터가 설정되지 않았습니다."),l.items.forEach((n,a)=>{if(!n.item){e=!0,t="설정되지 않은 아이템이 있습니다. ".concat(a+1,"번째 드랍아이템");return}if(n.roll<=0){var r;e=!0,t="드랍 주사위는 0이하가 될 수 없습니다. ".concat(null===(r=n.item)||void 0===r?void 0:r.name);return}}),e)return s().fire({title:"실패",text:t||"알수없는 에러",icon:"error",confirmButtonText:"확인"});(null==l?void 0:l._id)&&(null==l?void 0:l._id.length)===24?await (0,u.RD)(l):await (0,u.$b)(l),await s().fire({title:"성공",text:"수정되었습니다.",icon:"success",confirmButtonText:"확인"}),n.back()};return(0,r.useEffect)(()=>{"create"===c?d({monsterId:"",items:[]}):f(c)},[c]),(0,a.jsx)(i.Card,{children:(0,a.jsxs)(i.CardBody,{children:[(0,a.jsx)("h1",{className:"text-xl text-white bg-dark-blue mb-1",children:"드랍 정보"}),l&&(0,a.jsx)(x,{dropTable:l,setDropTable:d}),(0,a.jsx)(i.Button,{className:"flex items-center text-[14px]",size:"sm",onClick:()=>m(),children:"저장"})]})})}},38687:function(e,t,n){"use strict";n.d(t,{LJ:function(){return r},oE:function(){return a}});let a="https://dooboo.online:3001",r="/images/question_mark.webp"},605:function(e,t,n){"use strict";n.d(t,{ch:function(){return u},$b:function(){return I},PJ:function(){return E},mp:function(){return Z},nw:function(){return R},in:function(){return b},AS:function(){return H},V3:function(){return G},Kd:function(){return q},T7:function(){return D},Oz:function(){return v},wS:function(){return B},yJ:function(){return O},Gs:function(){return N},_t:function(){return g},YK:function(){return M},DJ:function(){return s},OY:function(){return x},sI:function(){return h},QN:function(){return w},ME:function(){return f},Bp:function(){return m},iX:function(){return _},VR:function(){return y},aM:function(){return o},fY:function(){return Y},Tp:function(){return A},DG:function(){return W},rJ:function(){return L},E:function(){return p},AJ:function(){return l},hv:function(){return F},je:function(){return j},O:function(){return P},RD:function(){return k},MC:function(){return d},gE:function(){return T},uw:function(){return S},ZR:function(){return C}});var a=n(7908),r=n(63411),i=n.n(r);let c=a.Z.create({baseURL:"https://dooboo.online:3001"});async function s(){let{data:e}=await c.get("/auth/jwt");return e}async function o(){let{data:e}=await c.get("/user/me");return e}async function u(e){let{data:t}=await c.get("/user/battle",{params:{name:e}});return t}async function l(e){let{data:t}=await c.post("/monster/create",e,{headers:{"Content-Type":"multipart/form-data"},transformRequest:[()=>e]});return t}async function d(e){let{data:t}=await c.put("/monster/update",e);return t}async function f(e){let{data:t}=await c.get("/monster/".concat(e));return t}async function m(){let{data:e}=await c.get("/monster/list");return e}async function p(e){let{data:t}=await c.post("/map/create",e);return t}async function x(e){let{data:t}=await c.get("/map/".concat(e));return t}async function h(){let{data:e}=await c.get("/map/list");return e}async function w(){let{data:e}=await c.get("/map/list-name");return e}async function b(e){let{data:t}=await c.delete("/map/delete",{data:{_id:e}});return t}async function v(){let{data:e}=await c.get("/item/base-weapon/list");return e}async function D(e){let{data:t}=await c.get("/item/base-weapon/".concat(e));return t}async function A(e){let{data:t}=await c.post("/item/base-weapon",e);return t}async function j(e){let{data:t}=await c.put("/item/base-weapon/".concat(e._id),e);return t}async function E(e){let{data:t}=await c.delete("/item/base-weapon/".concat(e));return t}async function y(){let{data:e}=await c.get("/character/rank");return e}async function _(){let{data:e}=await c.get("/character/inventory");return e}async function g(){let{data:e}=await c.get("/item/drop/list");return e}async function N(e){let{data:t}=await c.get("/item/drop/".concat(e));return t}async function k(e){let{data:t}=await c.put("/item/drop/".concat(e._id),e);return t}async function I(e){let{data:t}=await c.post("/item/drop",e);return t}async function R(e){let{data:t}=await c.delete("/item/drop/".concat(e));return t}async function C(e){let{data:t}=await c.post("/item/upload",{},{headers:{"Content-Type":"multipart/form-data"},transformRequest:[()=>e]});return t}async function G(e){let{data:t}=await c.post("/item/equip/".concat(e));return t}async function S(e){let{data:t}=await c.post("/item/unequip/".concat(e));return t}async function T(e){let{data:t}=await c.post("/item/sell",{itemIds:e});return t}async function M(e){let{data:t}=await c.get("/item/enhance-price/".concat(e));return t}async function H(e,t){let{data:n}=await c.post("/item/enhance/".concat(e),t);return n}async function W(e){let{data:t}=await c.post("/board/create",e);return t}async function P(e,t){let{data:n}=await c.put("/board/edit/".concat(e),t);return n}async function B(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{page:1},{data:n}=await c.post("/board/list",{condition:e,opts:t});return n}async function O(e){let{data:t}=await c.post("/board/".concat(e));return t}async function L(e,t){let{data:n}=await c.post("/board/comment/create/".concat(e),t);return n}async function Z(e){let{data:t}=await c.delete("/board/delete/".concat(e));return t}async function Y(e,t){let{data:n}=await c.post("/item/auction/add/".concat(e),t);return n}async function q(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0,{data:n}=await c.post("/item/auction/list",{condition:e,opts:t});return n}async function F(e){let{data:t}=await c.post("/item/auction/purchase/".concat(e));return t}c.interceptors.request.use(e=>{let t=localStorage.getItem("token");return e.headers.Authorization=t,e},e=>Promise.reject(e)),c.interceptors.response.use(e=>e,async e=>{let{code:t,message:n,response:a}=e,{status:r,data:c}=a||{};return await i().fire({title:t,text:(null==c?void 0:c.message)||n,icon:"error",confirmButtonText:"확인"}),Promise.reject(e)})},43951:function(e,t,n){"use strict";n.d(t,{Z:function(){return r}});var a=n(38687);function r(e){return!e||e.includes(a.oE)?e:"".concat(a.oE,"/").concat(e)}},40874:function(e,t,n){"use strict";n.d(t,{Z:function(){return r}});var a=n(41231);function r(){return(0,a.Z)()}},21471:function(e,t,n){"use strict";n.d(t,{Ap:function(){return l},F6:function(){return o},Iu:function(){return f},KR:function(){return s},W:function(){return u},dW:function(){return p},oK:function(){return m},qo:function(){return c},r5:function(){return d},v9:function(){return x}});var a=n(42151),r=n.n(a);n(30971);var i=n(84555);let c=e=>{let[t,n]=e;return"".concat(t," ~ ").concat(n)},s=e=>r()(e).format("YYYY-MM-DD HH:mm:ss"),o=e=>r()(e).fromNow(),u=e=>r()(e).format("MM/DD HH:mm:ss"),l=e=>r()(e).format("HH:mm"),d=e=>{if("weapon"===e.iType)return e.weapon;throw Error("Unknown Item Type")},f=e=>{let t=e;switch(e){case"axe":t="도끼";break;case"sword":t="검";break;case"dagger":t="단검";break;case"bow":t="활";break;case"blunt":t="둔기";break;case"spear":t="창";break;case"normal":t="일반";break;case"magic":t="마법";break;case"rare":t="희귀";break;case"epic":t="서사";break;case"INCREASED_DAMAGE":t="피해 증가(%)";break;case"INCREASED_PHYSICAL_DAMAGE":t="물리 피해 증가(%)";break;case"INCREASED_COLD_DAMAGE":t="냉기 피해 증가(%)";break;case"INCREASED_FIRE_DAMAGE":t="화염 피해 증가(%)";break;case"INCREASED_LIGHTNING_DAMAGE":t="번개 피해 증가(%)";break;case"ADDED_PHYSICAL_DAMAGE":t="물리 피해 추가(+)";break;case"ADDED_COLD_DAMAGE":t="냉기 피해 추가(+)";break;case"ADDED_FIRE_DAMAGE":t="화염 피해 추가(+)";break;case"ADDED_LIGHTNING_DAMAGE":t="번개 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_AXE":t="도끼 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_SWORD":t="검 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_DAGGER":t="단검 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_BOW":t="활 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_BLUNT":t="둔기 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_SPEAR":t="창 피해 추가(+)";break;case"INCREASED_DAMAGE_WITH_AXE":t="도끼 피해 증가(%)";break;case"INCREASED_DAMAGE_WITH_SWORD":t="검 피해 증가(%)";break;case"INCREASED_DAMAGE_WITH_DAGGER":t="단검 피해 증가(%)";break;case"INCREASED_DAMAGE_WITH_BOW":t="활 피해 증가(%)";break;case"INCREASED_DAMAGE_WITH_BLUNT":t="둔기 피해 증가(%)";break;case"INCREASED_DAMAGE_WITH_SPEAR":t="창 피해 증가(%)"}return t},m=e=>{let t="#fff";switch(e){case"normal":t="#ece0e0";break;case"magic":t="#0082ff";break;case"rare":t="#fdd125";break;case"epic":t="#6000d2"}return t},p=e=>(0,i.ZP)(e);function x(e,t){let n=e.split(","),a=n[0].match(/:(.*?);/)[1],r=atob(n[1]),i=r.length,c=new Uint8Array(i);for(;i--;)c[i]=r.charCodeAt(i);return new File([c],t,{type:a})}}},function(e){e.O(0,[6384,9461,6990,8694,7908,7187,2971,8069,1744],function(){return e(e.s=55142)}),_N_E=e.O()}]);