(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4910],{97098:function(t,e,n){Promise.resolve().then(n.bind(n,73233))},73233:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return D}});var a=n(57437),r=n(47907),c=n(2265),i=n(65615),o=n(63411),u=n.n(o),s=n(81393),l=n(65170),d=n.n(l),f=n(49241),m=n.n(f),p=n(605);let b=(0,n(24232).default)(async()=>{let{default:t}=await Promise.resolve().then(n.t.bind(n,65615,23));return function(e){let{forwardedRef:n,...r}=e;return(0,a.jsx)(t,{ref:n,...r})}},{loadableGenerated:{webpack:()=>[65615]},ssr:!1});var w=n(21471),A=n(40874);function D(t){let{params:e}=t,n=(0,c.useRef)(null),o=new s.r({cloud:{cloudName:"dqihpypxi"}}),[l,f]=(0,c.useState)(),[m,D]=(0,c.useState)(""),[E,g]=(0,c.useState)(""),y=(0,c.useCallback)(()=>{var t;let e=null===(t=n.current)||void 0===t?void 0:t.getEditor();if(!e)return;let a=document.createElement("input");a.setAttribute("type","file"),a.setAttribute("accept","image/*"),a.click(),a.onchange=async()=>{if(null!==a&&null!==a.files){let t=a.files[0],{secure_url:n}=await h(t),r=e.getSelection();e.insertEmbed(r.index,"image",n)}}},[]),h=async t=>{let e=new FormData;return e.append("file",t),e.append("upload_preset","broyhm4t"),fetch("https://api.cloudinary.com/v1_1/".concat(o.getConfig().cloud.cloudName,"/image/upload"),{method:"POST",body:e}).then(t=>t.json()).then(t=>t).catch(t=>{console.error("Error:",t),alert("Upload failed")})},_=(0,c.useMemo)(()=>({toolbar:{container:[[{header:[1,2,!1]}],["bold","italic","underline","strike","blockquote"],[{list:"ordered"},{list:"bullet"},{indent:"-1"},{indent:"+1"}],["link","image"],["clean"]],handlers:{image:y}},ImageResize:{parchment:i.Quill.import("parchment")},clipboard:{matchVisual:!1,matchers:[[1,(t,e)=>{let a=null==e?void 0:e.ops.map(e=>{var a;if(!(null==e?void 0:null===(a=e.insert)||void 0===a?void 0:a.image)||e.insert.image.indexOf("//res.cloudinary.com")>=0)return e;let r=(0,A.Z)(),c=(0,w.v9)(t.src,"".concat(r,".png")),i={...e.attributes,alt:"".concat(r)};return e.insert.image="/images/uploading.gif",setTimeout(async()=>{var t;let e=null===(t=n.current)||void 0===t?void 0:t.getEditor();if(!e)return;console.log(e.getSelection());let a=await h(c),i=e.root.querySelector("img[alt='".concat(r,"']"));i&&i.setAttribute("src",null==a?void 0:a.secure_url)},1),{...e,attributes:i}});e.ops=a;let r=new(d())().retain(e.length(),{header:3});return e.compose(r)}]]}}),[]),k=(0,r.useRouter)(),I=async()=>{let t={isValid:!0,message:""};if(E.length<2&&(t.isValid=!1,t.message="글제목이 너무 짧습니다. 2글자 이상 입력하세요."),E.length>=100&&(t.isValid=!1,t.message="제목은 최대 100자입니다."),m.length<=4&&(t.isValid=!1,t.message="글 내용이 너무 짧습니다."),m.length>=5e6&&(t.isValid=!1,t.message="글 내용이 너무 깁니다."),!t.isValid)return u().fire({title:t.message||"알수없는 에러",text:"-",icon:"error",confirmButtonText:"확인"});let n=await (0,p.O)(e.boardId,{content:m,title:E});await u().fire({title:"수정 되었습니다.",text:"".concat(n),icon:"success",confirmButtonText:"확인"}),k.back()},v=(0,c.useCallback)(async()=>{let t=await (0,p.yJ)(e.boardId);D(t.board.content),g(t.board.title)},[e.boardId]);return(0,c.useEffect)(()=>{v()},[v]),(0,a.jsxs)("div",{className:"ff-dodoom-all",children:[(0,a.jsx)("div",{className:"mb-[4px]",children:(0,a.jsx)("input",{value:E,onChange:t=>g(t.target.value),className:"w-full border border-[#cecdce] h-[40px] pl-[14px] placeholder:text-gray-700",placeholder:"제목을 입력하세요"})}),(0,a.jsx)(b,{forwardedRef:n,theme:"snow",value:m,placeholder:"이곳에 글 내용을 작성하세요",onChange:D,modules:_,className:"mb-[4px]"}),(0,a.jsxs)("div",{className:"flex justify-end",children:[(0,a.jsx)("div",{className:"flex justify-center items-center border border-gray-600 h-[40px] w-[100px] border-r-0 shadow-md shadow-gray-400 rounded-l cursor-pointer",onClick:()=>k.back(),children:"취소"}),(0,a.jsx)("div",{className:"flex justify-center items-center border border-gray-600 h-[40px] w-[100px] shadow-md shadow-gray-400 rounded-r cursor-pointer",onClick:()=>I(),children:"수정"})]})]})}n(21851),i.Quill.register("modules/ImageResize",m())},605:function(t,e,n){"use strict";n.d(e,{ch:function(){return s},$b:function(){return R},PJ:function(){return _},mp:function(){return V},nw:function(){return x},in:function(){return D},AS:function(){return W},V3:function(){return C},Kd:function(){return B},T7:function(){return g},Oz:function(){return E},wS:function(){return P},yJ:function(){return q},Gs:function(){return G},_t:function(){return v},YK:function(){return H},DJ:function(){return o},OY:function(){return b},sI:function(){return w},QN:function(){return A},ME:function(){return f},Bp:function(){return m},iX:function(){return I},VR:function(){return k},aM:function(){return u},fY:function(){return Y},Tp:function(){return y},DG:function(){return j},rJ:function(){return L},E:function(){return p},AJ:function(){return l},hv:function(){return J},je:function(){return h},O:function(){return O},RD:function(){return N},MC:function(){return d},gE:function(){return T},uw:function(){return S},ZR:function(){return M}});var a=n(7908),r=n(63411),c=n.n(r);let i=a.Z.create({baseURL:"https://dooboo.online:3001"});async function o(){let{data:t}=await i.get("/auth/jwt");return t}async function u(){let{data:t}=await i.get("/user/me");return t}async function s(t){let{data:e}=await i.get("/user/battle",{params:{name:t}});return e}async function l(t){let{data:e}=await i.post("/monster/create",t,{headers:{"Content-Type":"multipart/form-data"},transformRequest:[()=>t]});return e}async function d(t){let{data:e}=await i.put("/monster/update",t);return e}async function f(t){let{data:e}=await i.get("/monster/".concat(t));return e}async function m(){let{data:t}=await i.get("/monster/list");return t}async function p(t){let{data:e}=await i.post("/map/create",t);return e}async function b(t){let{data:e}=await i.get("/map/".concat(t));return e}async function w(){let{data:t}=await i.get("/map/list");return t}async function A(){let{data:t}=await i.get("/map/list-name");return t}async function D(t){let{data:e}=await i.delete("/map/delete",{data:{_id:t}});return e}async function E(){let{data:t}=await i.get("/item/base-weapon/list");return t}async function g(t){let{data:e}=await i.get("/item/base-weapon/".concat(t));return e}async function y(t){let{data:e}=await i.post("/item/base-weapon",t);return e}async function h(t){let{data:e}=await i.put("/item/base-weapon/".concat(t._id),t);return e}async function _(t){let{data:e}=await i.delete("/item/base-weapon/".concat(t));return e}async function k(){let{data:t}=await i.get("/character/rank");return t}async function I(){let{data:t}=await i.get("/character/inventory");return t}async function v(){let{data:t}=await i.get("/item/drop/list");return t}async function G(t){let{data:e}=await i.get("/item/drop/".concat(t));return e}async function N(t){let{data:e}=await i.put("/item/drop/".concat(t._id),t);return e}async function R(t){let{data:e}=await i.post("/item/drop",t);return e}async function x(t){let{data:e}=await i.delete("/item/drop/".concat(t));return e}async function M(t){let{data:e}=await i.post("/item/upload",{},{headers:{"Content-Type":"multipart/form-data"},transformRequest:[()=>t]});return e}async function C(t){let{data:e}=await i.post("/item/equip/".concat(t));return e}async function S(t){let{data:e}=await i.post("/item/unequip/".concat(t));return e}async function T(t){let{data:e}=await i.post("/item/sell",{itemIds:t});return e}async function H(t){let{data:e}=await i.get("/item/enhance-price/".concat(t));return e}async function W(t,e){let{data:n}=await i.post("/item/enhance/".concat(t),e);return n}async function j(t){let{data:e}=await i.post("/board/create",t);return e}async function O(t,e){let{data:n}=await i.put("/board/edit/".concat(t),e);return n}async function P(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{page:1},{data:n}=await i.post("/board/list",{condition:t,opts:e});return n}async function q(t){let{data:e}=await i.post("/board/".concat(t));return e}async function L(t,e){let{data:n}=await i.post("/board/comment/create/".concat(t),e);return n}async function V(t){let{data:e}=await i.delete("/board/delete/".concat(t));return e}async function Y(t,e){let{data:n}=await i.post("/item/auction/add/".concat(t),e);return n}async function B(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1?arguments[1]:void 0,{data:n}=await i.post("/item/auction/list",{condition:t,opts:e});return n}async function J(t){let{data:e}=await i.post("/item/auction/purchase/".concat(t));return e}i.interceptors.request.use(t=>{let e=localStorage.getItem("token");return t.headers.Authorization=e,t},t=>Promise.reject(t)),i.interceptors.response.use(t=>t,async t=>{let{code:e,message:n,response:a}=t,{status:r,data:i}=a||{};return await c().fire({title:e,text:(null==i?void 0:i.message)||n,icon:"error",confirmButtonText:"확인"}),Promise.reject(t)})},40874:function(t,e,n){"use strict";n.d(e,{Z:function(){return r}});var a=n(41231);function r(){return(0,a.Z)()}},21471:function(t,e,n){"use strict";n.d(e,{Ap:function(){return l},F6:function(){return u},Iu:function(){return f},KR:function(){return o},W:function(){return s},dW:function(){return p},oK:function(){return m},qo:function(){return i},r5:function(){return d},v9:function(){return b}});var a=n(42151),r=n.n(a);n(30971);var c=n(84555);let i=t=>{let[e,n]=t;return"".concat(e," ~ ").concat(n)},o=t=>r()(t).format("YYYY-MM-DD HH:mm:ss"),u=t=>r()(t).fromNow(),s=t=>r()(t).format("MM/DD HH:mm:ss"),l=t=>r()(t).format("HH:mm"),d=t=>{if("weapon"===t.iType)return t.weapon;throw Error("Unknown Item Type")},f=t=>{let e=t;switch(t){case"axe":e="도끼";break;case"sword":e="검";break;case"dagger":e="단검";break;case"bow":e="활";break;case"blunt":e="둔기";break;case"spear":e="창";break;case"normal":e="일반";break;case"magic":e="마법";break;case"rare":e="희귀";break;case"epic":e="서사";break;case"INCREASED_DAMAGE":e="피해 증가(%)";break;case"INCREASED_PHYSICAL_DAMAGE":e="물리 피해 증가(%)";break;case"INCREASED_COLD_DAMAGE":e="냉기 피해 증가(%)";break;case"INCREASED_FIRE_DAMAGE":e="화염 피해 증가(%)";break;case"INCREASED_LIGHTNING_DAMAGE":e="번개 피해 증가(%)";break;case"ADDED_PHYSICAL_DAMAGE":e="물리 피해 추가(+)";break;case"ADDED_COLD_DAMAGE":e="냉기 피해 추가(+)";break;case"ADDED_FIRE_DAMAGE":e="화염 피해 추가(+)";break;case"ADDED_LIGHTNING_DAMAGE":e="번개 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_AXE":e="도끼 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_SWORD":e="검 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_DAGGER":e="단검 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_BOW":e="활 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_BLUNT":e="둔기 피해 추가(+)";break;case"ADDED_DAMAGE_WITH_SPEAR":e="창 피해 추가(+)";break;case"INCREASED_DAMAGE_WITH_AXE":e="도끼 피해 증가(%)";break;case"INCREASED_DAMAGE_WITH_SWORD":e="검 피해 증가(%)";break;case"INCREASED_DAMAGE_WITH_DAGGER":e="단검 피해 증가(%)";break;case"INCREASED_DAMAGE_WITH_BOW":e="활 피해 증가(%)";break;case"INCREASED_DAMAGE_WITH_BLUNT":e="둔기 피해 증가(%)";break;case"INCREASED_DAMAGE_WITH_SPEAR":e="창 피해 증가(%)"}return e},m=t=>{let e="#fff";switch(t){case"normal":e="#ece0e0";break;case"magic":e="#0082ff";break;case"rare":e="#fdd125";break;case"epic":e="#6000d2"}return e},p=t=>(0,c.ZP)(t);function b(t,e){let n=t.split(","),a=n[0].match(/:(.*?);/)[1],r=atob(n[1]),c=r.length,i=new Uint8Array(c);for(;c--;)i[c]=r.charCodeAt(c);return new File([i],e,{type:a})}}},function(t){t.O(0,[9461,6990,9363,697,7908,7187,4809,1459,2971,8069,1744],function(){return t(t.s=97098)}),_N_E=t.O()}]);