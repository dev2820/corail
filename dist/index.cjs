"use strict";var o=Object.defineProperty;var a=Object.getOwnPropertyDescriptor;var y=Object.getOwnPropertyNames;var F=Object.prototype.hasOwnProperty;var d=(e,r)=>{for(var n in r)o(e,n,{get:r[n],enumerable:!0})},f=(e,r,n,c)=>{if(r&&typeof r=="object"||typeof r=="function")for(let t of y(r))!F.call(e,t)&&t!==n&&o(e,t,{get:()=>r[t],enumerable:!(c=a(r,t))||c.enumerable});return e};var m=e=>f(o({},"__esModule",{value:!0}),e);var P={};d(P,{isFailed:()=>s,rail:()=>b});module.exports=m(P);var l=e=>e instanceof Promise;var u=Symbol("failed"),i=e=>({failed:u,err:e}),x=(e,r)=>{if(l(e))return e.then(n=>s(n)?n:r(n)).catch(n=>i(n));try{return s(e)?e:r(e)}catch(n){return i(n)}},s=e=>e instanceof Object&&e.failed===u,b=(...e)=>async r=>{try{return await e.reduce(x,r)}catch(n){return i(n)}};0&&(module.exports={isFailed,rail});
