(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();document.querySelector("#app").innerHTML=`
  <div>
    <h1>图片编辑器</h1>
    <div class="card">
    <h3>水印</h3>
    <p>
    <label>
    <span>文字:</span>
    <input type="text" name="watermark_text" id="watermark_text" value="watermark"/>
    <label>
    </p>
    <p>
    <label>
    <span>字体:</span>
    <select name="watermark_font_family" id="watermark_font_family">
      <option value='serif'>serif</option>
      <option value='sans-serif'>sans-serif</option>
      <option value='monospace'>monospace</option>
    </select>
    <input type="range" name="watermark_font_size" id="watermark_font_size" value="50"/>
    <label>
    </p>
    <p>
    <p>
    <label>
    <span>颜色:</span>
    <input type="color" name="watermark_color" id="watermark_color" value="#FFFFFF"/>
    <label>
    </p>
    <p>
    <label>
    <span>空心:</span>
    <input type="checkbox" name="watermark_stroke" id="watermark_stroke"/>
    <label>
    </p>
    <p>
    <label>
    <span>透明:</span>
    <input type="range" name="watermark_opacity" id="watermark_opacity" value="20"/>
    <label>
    </p>
    <p>
    <label>
    <span>密度:</span>
    <input type="range" name="watermark_count" id="watermark_count" value="50"/>
    <label>
    </p>
    <p>
    <span>模板:</span>
    <button name="load_watermark_options" id="load_watermark_options">加载</button>
    <button name="store_watermark_options" id="store_watermark_options">保存</button>
    </p>
    </div>
    <hr />
    <h3>图片预览</h3>
    <p>
    <label>
    <span>选择图片:</span>
    <input type="file" name="source_images" id="source_images" multiple accept="image/*" />
    <label>
    </p>
    <div id="preview_images">请先选择图片</div>
  </div>
`;const v=document.querySelector("#watermark_text"),x=document.querySelector("#watermark_font_family"),b=document.querySelector("#watermark_font_size"),S=document.querySelector("#watermark_color"),q=document.querySelector("#watermark_opacity"),L=document.querySelector("#watermark_stroke"),T=document.querySelector("#watermark_count"),A=document.querySelector("#source_images"),I=document.querySelector("#preview_images"),E=document.querySelector("#load_watermark_options"),R=document.querySelector("#store_watermark_options"),j=o=>new Promise((a,n)=>{const r=new FileReader;r.onload=e=>{const t=new Image;t.title=o.name,t.src=e.target.result,a(t)},r.onerror=e=>{n(e)},r.readAsDataURL(o)});class H{constructor(a){this.image=a,this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d")}updateImage(){return this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.canvas.width=this.image.width,this.canvas.height=this.image.height,this.ctx.drawImage(this.image,0,0),this}drawLine(a,n,r,e){const t=this.ctx;t.beginPath(),t.moveTo(a.x+r,a.y),t.lineTo(n.x+r,n.y),t.stroke()}updateText({text:a,font_size:n,font_family:r,color:e,stroke:t,opacity:i,count:h=4}){this.updateImage();const c=this.ctx;c.globalAlpha=i/100,c.font=`${n}px ${r}`,c.strokeStyle=e,c.fillStyle=e,c.lineWidth=4,c.textBaseline="middle";const{width:M}=c.measureText(a),k=h,g=h,P=Math.round(this.canvas.width/g),N=Math.round(this.canvas.height/k);let d=[];for(let s=0;s<k;s++){let _=[];for(let u=0;u<g;u++){const p=s*P,l=u*N+n;_.push({x:p,y:l,i:s,j:u})}d.push(_)}for(const s of d.flat()){const{x:_,y:u,i:p,j:l}=s;if(!((p+l)%2===0)||(t?c.strokeText(a,_,u):c.fillText(a,_,u),p===k-1))continue;const w=M/2,y=n/2;if(l===0){const f=d[p+1][l+1];this.drawLine(s,f,w,y)}else if(l===g-1){const f=d[p+1][l-1];this.drawLine(f,s,w,y)}else{const f=d[p+1][l+1];this.drawLine(s,f,w,y);const z=d[p+1][l-1];this.drawLine(z,s,w,y)}}return this}}let O=[];const F=()=>{const o=v.value,a=+b.value,n=x.value,r=S.value,e=L.checked,t=+q.value,i=Math.round(+T.value/10);return{text:o,font_size:a,font_family:n,color:r,stroke:e,opacity:t,count:i}},m=async()=>{const o=F();console.log(o);for(const a of O)a.updateText(o)},J=async o=>{const a=F();I.innerHTML="";for(const n of o){const r=await j(n),e=new H(r);e.updateText(a),I.append(e.canvas),O.push(e)}};v.oninput=m;b.oninput=m;x.oninput=m;S.oninput=m;L.onchange=m;q.oninput=m;T.oninput=m;A.onchange=async o=>{const a=o.target.files;J(a)};E.onclick=()=>{const o=localStorage.getItem("watermark_options");if(o)try{const{text:a,font_size:n,font_family:r,color:e,stroke:t,opacity:i,count:h}=JSON.parse(o);v.value=a,b.value=n,x.value=r,S.value=e,L.checked=t,q.value=i,T.value=h}catch{}};R.onclick=()=>{const o=F();localStorage.setItem("watermark_options",JSON.stringify(o)),alert("保存成功")};
