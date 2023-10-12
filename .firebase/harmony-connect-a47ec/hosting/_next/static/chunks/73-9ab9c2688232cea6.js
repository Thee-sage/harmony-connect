"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[73],{5073:function(e,t,n){let a,i,r,o,s,l;n.d(t,{IH:function(){return eF}});var c,u=n(3991),d=n(6914),f=n(8745),p=n(5538);let h=(e,t)=>t.some(t=>e instanceof t),g=new WeakMap,m=new WeakMap,w=new WeakMap,y=new WeakMap,v=new WeakMap,b={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return m.get(e);if("objectStoreNames"===t)return e.objectStoreNames||w.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return I(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function I(e){var t;if(e instanceof IDBRequest)return function(e){let t=new Promise((t,n)=>{let a=()=>{e.removeEventListener("success",i),e.removeEventListener("error",r)},i=()=>{t(I(e.result)),a()},r=()=>{n(e.error),a()};e.addEventListener("success",i),e.addEventListener("error",r)});return t.then(t=>{t instanceof IDBCursor&&g.set(t,e)}).catch(()=>{}),v.set(t,e),t}(e);if(y.has(e))return y.get(e);let n="function"==typeof(t=e)?t!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(i||(i=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(t)?function(...e){return t.apply(T(this),e),I(g.get(this))}:function(...e){return I(t.apply(T(this),e))}:function(e,...n){let a=t.call(T(this),e,...n);return w.set(a,e.sort?e.sort():[e]),I(a)}:(t instanceof IDBTransaction&&function(e){if(m.has(e))return;let t=new Promise((t,n)=>{let a=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",r),e.removeEventListener("abort",r)},i=()=>{t(),a()},r=()=>{n(e.error||new DOMException("AbortError","AbortError")),a()};e.addEventListener("complete",i),e.addEventListener("error",r),e.addEventListener("abort",r)});m.set(e,t)}(t),h(t,a||(a=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])))?new Proxy(t,b):t;return n!==e&&(y.set(e,n),v.set(n,e)),n}let T=e=>v.get(e),D=["get","getKey","getAll","getAllKeys","count"],S=["put","add","delete","clear"],k=new Map;function C(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&"string"==typeof t))return;if(k.get(t))return k.get(t);let n=t.replace(/FromIndex$/,""),a=t!==n,i=S.includes(n);if(!(n in(a?IDBIndex:IDBObjectStore).prototype)||!(i||D.includes(n)))return;let r=async function(e,...t){let r=this.transaction(e,i?"readwrite":"readonly"),o=r.store;return a&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),i&&r.done]))[0]};return k.set(t,r),r}b={...c=b,get:(e,t,n)=>C(e,t)||c.get(e,t,n),has:(e,t)=>!!C(e,t)||c.has(e,t)};let j="@firebase/installations",$="0.6.4",A=`w:${$}`,E="FIS_v2",M=new f.LL("installations","Installations",{"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."});function x(e){return e instanceof f.ZR&&e.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function L({projectId:e}){return`https://firebaseinstallations.googleapis.com/v1/projects/${e}/installations`}function P(e){return{token:e.token,requestStatus:2,expiresIn:Number(e.expiresIn.replace("s","000")),creationTime:Date.now()}}async function q(e,t){let n=await t.json(),a=n.error;return M.create("request-failed",{requestName:e,serverCode:a.code,serverMessage:a.message,serverStatus:a.status})}function F({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}async function B(e){let t=await e();return t.status>=500&&t.status<600?e():t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function N({appConfig:e,heartbeatServiceProvider:t},{fid:n}){let a=L(e),i=F(e),r=t.getImmediate({optional:!0});if(r){let e=await r.getHeartbeatsHeader();e&&i.append("x-firebase-client",e)}let o={fid:n,authVersion:E,appId:e.appId,sdkVersion:A},s={method:"POST",headers:i,body:JSON.stringify(o)},l=await B(()=>fetch(a,s));if(l.ok){let e=await l.json(),t={fid:e.fid||n,registrationStatus:2,refreshToken:e.refreshToken,authToken:P(e.authToken)};return t}throw await q("Create Installation",l)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function O(e){return new Promise(t=>{setTimeout(t,e)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let z=/^[cdef][\w-]{21}$/;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function K(e){return`${e.appName}!${e.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let _=new Map;function R(e,t){let n=K(e);U(n,t),function(e,t){let n=(!V&&"BroadcastChannel"in self&&((V=new BroadcastChannel("[Firebase] FID Change")).onmessage=e=>{U(e.data.key,e.data.fid)}),V);n&&n.postMessage({key:e,fid:t}),0===_.size&&V&&(V.close(),V=null)}(n,t)}function U(e,t){let n=_.get(e);if(n)for(let e of n)e(t)}let V=null,W="firebase-installations-store",X=null;function H(){return X||(X=function(e,t,{blocked:n,upgrade:a,blocking:i,terminated:r}={}){let o=indexedDB.open(e,1),s=I(o);return a&&o.addEventListener("upgradeneeded",e=>{a(I(o.result),e.oldVersion,e.newVersion,I(o.transaction))}),n&&o.addEventListener("blocked",()=>n()),s.then(e=>{r&&e.addEventListener("close",()=>r()),i&&e.addEventListener("versionchange",()=>i())}).catch(()=>{}),s}("firebase-installations-database",0,{upgrade:(e,t)=>{0===t&&e.createObjectStore(W)}})),X}async function G(e,t){let n=K(e),a=await H(),i=a.transaction(W,"readwrite"),r=i.objectStore(W),o=await r.get(n);return await r.put(t,n),await i.done,o&&o.fid===t.fid||R(e,t.fid),t}async function Z(e){let t=K(e),n=await H(),a=n.transaction(W,"readwrite");await a.objectStore(W).delete(t),await a.done}async function J(e,t){let n=K(e),a=await H(),i=a.transaction(W,"readwrite"),r=i.objectStore(W),o=await r.get(n),s=t(o);return void 0===s?await r.delete(n):await r.put(s,n),await i.done,s&&(!o||o.fid!==s.fid)&&R(e,s.fid),s}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Y(e){let t;let n=await J(e.appConfig,n=>{let a=function(e){let t=e||{fid:function(){try{let e=new Uint8Array(17),t=self.crypto||self.msCrypto;t.getRandomValues(e),e[0]=112+e[0]%16;let n=function(e){let t=/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){let t=btoa(String.fromCharCode(...e));return t.replace(/\+/g,"-").replace(/\//g,"_")}(e);return t.substr(0,22)}(e);return z.test(n)?n:""}catch(e){return""}}(),registrationStatus:0};return en(t)}(n),i=function(e,t){if(0===t.registrationStatus){if(!navigator.onLine){let e=Promise.reject(M.create("app-offline"));return{installationEntry:t,registrationPromise:e}}let n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},a=Q(e,n);return{installationEntry:n,registrationPromise:a}}return 1===t.registrationStatus?{installationEntry:t,registrationPromise:ee(e)}:{installationEntry:t}}(e,a);return t=i.registrationPromise,i.installationEntry});return""===n.fid?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}async function Q(e,t){try{let n=await N(e,t);return G(e.appConfig,n)}catch(n){throw x(n)&&409===n.customData.serverCode?await Z(e.appConfig):await G(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function ee(e){let t=await et(e.appConfig);for(;1===t.registrationStatus;)await O(100),t=await et(e.appConfig);if(0===t.registrationStatus){let{installationEntry:t,registrationPromise:n}=await Y(e);return n||t}return t}function et(e){return J(e,e=>{if(!e)throw M.create("installation-not-found");return en(e)})}function en(e){return 1===e.registrationStatus&&e.registrationTime+1e4<Date.now()?{fid:e.fid,registrationStatus:0}:e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ea({appConfig:e,heartbeatServiceProvider:t},n){let a=function(e,{fid:t}){return`${L(e)}/${t}/authTokens:generate`}(e,n),i=function(e,{refreshToken:t}){let n=F(e);return n.append("Authorization",`${E} ${t}`),n}(e,n),r=t.getImmediate({optional:!0});if(r){let e=await r.getHeartbeatsHeader();e&&i.append("x-firebase-client",e)}let o={installation:{sdkVersion:A,appId:e.appId}},s={method:"POST",headers:i,body:JSON.stringify(o)},l=await B(()=>fetch(a,s));if(l.ok){let e=await l.json(),t=P(e);return t}throw await q("Generate Auth Token",l)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ei(e,t=!1){let n;let a=await J(e.appConfig,a=>{var i;if(!el(a))throw M.create("not-registered");let r=a.authToken;if(!t&&2===(i=r).requestStatus&&!function(e){let t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+36e5}(i))return a;if(1===r.requestStatus)return n=er(e,t),a;{if(!navigator.onLine)throw M.create("app-offline");let t=function(e){let t={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},e),{authToken:t})}(a);return n=es(e,t),t}}),i=n?await n:a.authToken;return i}async function er(e,t){let n=await eo(e.appConfig);for(;1===n.authToken.requestStatus;)await O(100),n=await eo(e.appConfig);let a=n.authToken;return 0===a.requestStatus?ei(e,t):a}function eo(e){return J(e,e=>{if(!el(e))throw M.create("not-registered");let t=e.authToken;return 1===t.requestStatus&&t.requestTime+1e4<Date.now()?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function es(e,t){try{let n=await ea(e,t),a=Object.assign(Object.assign({},t),{authToken:n});return await G(e.appConfig,a),n}catch(n){if(x(n)&&(401===n.customData.serverCode||404===n.customData.serverCode))await Z(e.appConfig);else{let n=Object.assign(Object.assign({},t),{authToken:{requestStatus:0}});await G(e.appConfig,n)}throw n}}function el(e){return void 0!==e&&2===e.registrationStatus}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ec(e){let{installationEntry:t,registrationPromise:n}=await Y(e);return n?n.catch(console.error):ei(e).catch(console.error),t.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function eu(e,t=!1){await ed(e);let n=await ei(e,t);return n.token}async function ed(e){let{registrationPromise:t}=await Y(e);t&&await t}function ef(e){return M.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ep="installations";(0,u.Xd)(new p.wA(ep,e=>{let t=e.getProvider("app").getImmediate(),n=/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){if(!e||!e.options)throw ef("App Configuration");if(!e.name)throw ef("App Name");for(let t of["projectId","apiKey","appId"])if(!e.options[t])throw ef(t);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}(t),a=(0,u.qX)(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:a,_delete:()=>Promise.resolve()}},"PUBLIC")),(0,u.Xd)(new p.wA("installations-internal",e=>{let t=e.getProvider("app").getImmediate(),n=(0,u.qX)(t,ep).getImmediate();return{getId:()=>ec(n),getToken:e=>eu(n,e)}},"PRIVATE")),(0,u.KN)(j,$),(0,u.KN)(j,$,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eh="analytics",eg="https://www.googletagmanager.com/gtag/js",em=new d.Yd("@firebase/analytics"),ew=new f.LL("analytics","Analytics",{"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-intialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."});/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ey(e){if(!e.startsWith(eg)){let t=ew.create("invalid-gtag-resource",{gtagURL:e});return em.warn(t.message),""}return e}function ev(e){return Promise.all(e.map(e=>e.catch(e=>e)))}async function eb(e,t,n,a,i,r){let o=a[i];try{if(o)await t[o];else{let e=await ev(n),a=e.find(e=>e.measurementId===i);a&&await t[a.appId]}}catch(e){em.error(e)}e("config",i,r)}async function eI(e,t,n,a,i){try{let r=[];if(i&&i.send_to){let e=i.send_to;Array.isArray(e)||(e=[e]);let a=await ev(n);for(let n of e){let e=a.find(e=>e.measurementId===n),i=e&&t[e.appId];if(i)r.push(i);else{r=[];break}}}0===r.length&&(r=Object.values(t)),await Promise.all(r),e("event",a,i||{})}catch(e){em.error(e)}}let eT=new class{constructor(e={},t=1e3){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}};async function eD(e){var t;let{appId:n,apiKey:a}=e,i={method:"GET",headers:new Headers({Accept:"application/json","x-goog-api-key":a})},r="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig".replace("{app-id}",n),o=await fetch(r,i);if(200!==o.status&&304!==o.status){let e="";try{let n=await o.json();(null===(t=n.error)||void 0===t?void 0:t.message)&&(e=n.error.message)}catch(e){}throw ew.create("config-fetch-failed",{httpStatus:o.status,responseMessage:e})}return o.json()}async function eS(e,t=eT,n){let{appId:a,apiKey:i,measurementId:r}=e.options;if(!a)throw ew.create("no-app-id");if(!i){if(r)return{measurementId:r,appId:a};throw ew.create("no-api-key")}let o=t.getThrottleMetadata(a)||{backoffCount:0,throttleEndTimeMillis:Date.now()},s=new eC;return setTimeout(async()=>{s.abort()},void 0!==n?n:6e4),ek({appId:a,apiKey:i,measurementId:r},o,s,t)}async function ek(e,{throttleEndTimeMillis:t,backoffCount:n},a,i=eT){var r;let{appId:o,measurementId:s}=e;try{await new Promise((e,n)=>{let i=Math.max(t-Date.now(),0),r=setTimeout(e,i);a.addEventListener(()=>{clearTimeout(r),n(ew.create("fetch-throttle",{throttleEndTimeMillis:t}))})})}catch(e){if(s)return em.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${s} provided in the "measurementId" field in the local Firebase config. [${null==e?void 0:e.message}]`),{appId:o,measurementId:s};throw e}try{let t=await eD(e);return i.deleteThrottleMetadata(o),t}catch(c){if(!function(e){if(!(e instanceof f.ZR)||!e.customData)return!1;let t=Number(e.customData.httpStatus);return 429===t||500===t||503===t||504===t}(c)){if(i.deleteThrottleMetadata(o),s)return em.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${s} provided in the "measurementId" field in the local Firebase config. [${null==c?void 0:c.message}]`),{appId:o,measurementId:s};throw c}let t=503===Number(null===(r=null==c?void 0:c.customData)||void 0===r?void 0:r.httpStatus)?(0,f.$s)(n,i.intervalMillis,30):(0,f.$s)(n,i.intervalMillis),l={throttleEndTimeMillis:Date.now()+t,backoffCount:n+1};return i.setThrottleMetadata(o,l),em.debug(`Calling attemptFetch again in ${t} millis`),ek(e,l,a,i)}}class eC{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function ej(e,t,n,a,i){if(i&&i.global){e("event",n,a);return}{let i=await t,r=Object.assign(Object.assign({},a),{send_to:i});e("event",n,r)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function e$(){if(!(0,f.hl)())return em.warn(ew.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;try{await (0,f.eu)()}catch(e){return em.warn(ew.create("indexeddb-unavailable",{errorInfo:null==e?void 0:e.toString()}).message),!1}return!0}async function eA(e,t,n,a,i,s,l){var c;let u=eS(e);u.then(t=>{n[t.measurementId]=t.appId,e.options.measurementId&&t.measurementId!==e.options.measurementId&&em.warn(`The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${t.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(e=>em.error(e)),t.push(u);let d=e$().then(e=>e?a.getId():void 0),[f,p]=await Promise.all([u,d]);!function(e){let t=window.document.getElementsByTagName("script");for(let n of Object.values(t))if(n.src&&n.src.includes(eg)&&n.src.includes(e))return n;return null}(s)&&function(e,t){let n;let a=(window.trustedTypes&&(n=window.trustedTypes.createPolicy("firebase-js-sdk-policy",{createScriptURL:ey})),n),i=document.createElement("script"),r=`${eg}?l=${e}&id=${t}`;i.src=a?null==a?void 0:a.createScriptURL(r):r,i.async=!0,document.head.appendChild(i)}(s,f.measurementId),o&&(i("consent","default",o),o=void 0),i("js",new Date);let h=null!==(c=null==l?void 0:l.config)&&void 0!==c?c:{};return h.origin="firebase",h.update=!0,null!=p&&(h.firebase_id=p),i("config",f.measurementId,h),r&&(i("set",r),r=void 0),f.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eE{constructor(e){this.app=e}_delete(){return delete eM[this.app.options.appId],Promise.resolve()}}let eM={},ex=[],eL={},eP="dataLayer",eq=!1;function eF(e=(0,u.Mq)()){e=(0,f.m9)(e);let t=(0,u.qX)(e,eh);return t.isInitialized()?t.getImmediate():function(e,t={}){let n=(0,u.qX)(e,eh);if(n.isInitialized()){let e=n.getImmediate();if((0,f.vZ)(t,n.getOptions()))return e;throw ew.create("already-initialized")}let a=n.initialize({options:t});return a}(e)}let eB="@firebase/analytics",eN="0.10.0";(0,u.Xd)(new p.wA(eh,(e,{options:t})=>{let n=e.getProvider("app").getImmediate(),a=e.getProvider("installations-internal").getImmediate();return function(e,t,n){!function(){let e=[];if((0,f.ru)()&&e.push("This is a browser extension environment."),(0,f.zI)()||e.push("Cookies are not available."),e.length>0){let t=e.map((e,t)=>`(${t+1}) ${e}`).join(" "),n=ew.create("invalid-analytics-context",{errorInfo:t});em.warn(n.message)}}();let a=e.options.appId;if(!a)throw ew.create("no-app-id");if(!e.options.apiKey){if(e.options.measurementId)em.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw ew.create("no-api-key")}if(null!=eM[a])throw ew.create("already-exists",{id:a});if(!eq){var i,r;let e,t;e=[],Array.isArray(window[eP])?e=window[eP]:window[eP]=e;let{wrappedGtag:n,gtagCore:a}=(i="gtag",t=function(...e){window[eP].push(arguments)},window[i]&&"function"==typeof window[i]&&(t=window[i]),window[i]=(r=t,async function(e,...t){try{if("event"===e){let[e,n]=t;await eI(r,eM,ex,e,n)}else if("config"===e){let[e,n]=t;await eb(r,eM,ex,eL,e,n)}else if("consent"===e){let[e]=t;r("consent","update",e)}else if("get"===e){let[e,n,a]=t;r("get",e,n,a)}else if("set"===e){let[e]=t;r("set",e)}else r(e,...t)}catch(e){em.error(e)}}),{gtagCore:t,wrappedGtag:window[i]});l=n,s=a,eq=!0}eM[a]=eA(e,ex,eL,t,s,eP,n);let o=new eE(e);return o}(n,a,t)},"PUBLIC")),(0,u.Xd)(new p.wA("analytics-internal",function(e){try{let t=e.getProvider(eh).getImmediate();return{logEvent:(e,n,a)=>(function(e,t,n,a){ej(l,eM[(e=(0,f.m9)(e)).app.options.appId],t,n,a).catch(e=>em.error(e))})(t,e,n,a)}}catch(e){throw ew.create("interop-component-reg-failed",{reason:e})}},"PRIVATE")),(0,u.KN)(eB,eN),(0,u.KN)(eB,eN,"esm2017")}}]);